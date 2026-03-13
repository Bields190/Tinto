import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdegaService } from '../../service/adega.service';

interface PhotoSlot {
  file?: File;
  url?: string;
}

@Component({
  selector: 'app-adicionar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './adicionar.html',
  styleUrl: './adicionar.scss',
})
export class Adicionar {
  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef<HTMLInputElement>>;

  form: FormGroup;
  rating = 0;
  hoverRating = 0;
  photos: PhotoSlot[] = Array.from({ length: 4 }, () => ({}));
  private readonly adegaService = inject(AdegaService);
  private readonly router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.carregarDadosVinho(id); 
    }
  }

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nomeVinho: ['', Validators.required],
      vinicola: ['', Validators.required],
      uva: ['', Validators.required],
      pais: ['', Validators.required],
      teorAlcoolico: [7],
      dataConsumo: [''],
      harmonizacao: [''],
      comments: [''],
      rating: [0]
    });
  }

  setRating(value: number) {
    this.rating = value;
    this.form.get('rating')?.setValue(value);
  }

  setHover(value: number) {
    this.hoverRating = value;
  }

  clearHover() {
    this.hoverRating = 0;
  }

  triggerFileInput(index: number) {
    const input = this.fileInputs.toArray()[index]?.nativeElement;
    input?.click();
  }

  onFileSelected(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const url = URL.createObjectURL(file);

    // Revoke previous object URL if exists
    const existing = this.photos[index]?.url;
    if (existing) {
      URL.revokeObjectURL(existing);
    }

    this.photos[index] = { file, url };
    // Force change detection for *ngFor / template update
    this.photos = [...this.photos];

    // Reset input to allow selecting the same file again
    input.value = '';
  }

  protected salvarVinho(): void {
  if (this.form.invalid) return;

  const id = this.activatedRoute.snapshot.paramMap.get('id');
  const vinhoData = {
    nome: this.form.value.nomeVinho,
    vinicola: this.form.value.vinicola,
    tipoUva: this.form.value.uva,
    pais: this.form.value.pais,
    teorAlcoolico: this.form.value.teorAlcoolico,
    dataConsumo: this.form.value.dataConsumo,
    harmonizacoes: this.form.value.harmonizacao ? [this.form.value.harmonizacao] : [],
    avaliacao: this.rating,
    comentario: this.form.value.comments,
    isFavorito: false
  };

  if (id) {
    // --- MODO EDIÇÃO (PUT) ---
    this.adegaService.atualizarVinho(id, vinhoData).subscribe({
      next: () => {
        const novasFotos = this.photos.filter(p => p.file);
        if (novasFotos.length > 0) {
          this.adegaService.uploadFotos(parseInt(id), novasFotos.map(p => p.file!)).subscribe({
            next: () => this.router.navigate(['/adega'])
          });
        } else {
          this.router.navigate(['/adega']);
        }
      }
    });
  } else {
    // --- MODO CADASTRO (POST) ---
    this.adegaService.registrarVinho(vinhoData).subscribe({
      next: (vinhoCriado) => {
        const arquivosParaUpload = this.photos.filter(p => p.file).map(p => p.file!);
        if (arquivosParaUpload.length > 0) {
          this.adegaService.uploadFotos(vinhoCriado.id, arquivosParaUpload).subscribe({
            next: () => this.router.navigate(['/adega'])
          });
        } else {
          this.router.navigate(['/adega']);
        }
      }
    });
  }
}

  carregarDadosVinho(id: string) {
  const idNumerico = parseInt(id, 10); 
  
  this.adegaService.buscarVinhoPorId(idNumerico).subscribe({
    next: (vinho) => {
      // 1. Preencher o formulário
      this.form.patchValue({
        nomeVinho: vinho.nome,
        vinicola: vinho.vinicola,
        uva: vinho.tipoUva,
        pais: vinho.pais,
        teorAlcoolico: vinho.teorAlcoolico,
        dataConsumo: vinho.dataConsumo,
        harmonizacao: vinho.harmonizacoes ? vinho.harmonizacoes.join(', ') : '',
        comments: vinho.comentario
      });

      this.rating = vinho.avaliacao ?? 0;

      // 2. Preencher as fotos existentes (Agora dentro do subscribe!)
      if (vinho.fotos && vinho.fotos.length > 0) {
        this.photos = vinho.fotos.map(f => ({
          url: `http://localhost:8080/api/fotos/exibir/${f.arquivoPath}`
        }));
        
        // Preencher o restante dos slots vazios até 4
        while (this.photos.length < 4) {
          this.photos.push({});
        }
      } else {
        // Se não houver fotos, garante que o array esteja limpo com slots vazios
        this.photos = Array.from({ length: 4 }, () => ({}));
      }
    },
    error: (err) => console.error('Erro ao carregar dados do vinho', err)
  });
}
}
