import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdegaService } from '../../service/adega.service';

interface PhotoSlot {
  id?: number;
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
  photos: PhotoSlot[] = Array.from({ length: 3 }, () => ({}));
  private readonly adegaService = inject(AdegaService);
  private readonly router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  protected readonly currentYear = new Date().getFullYear();

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
      safra: [new Date().getFullYear()],
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

    const existing = this.photos[index]?.url;
    if (existing) {
      URL.revokeObjectURL(existing);
    }

    this.photos[index] = { file, url };
    this.photos = [...this.photos];
    input.value = '';
  }

  removePhoto(index: number, event: MouseEvent) {
    event.stopPropagation();
    const photo = this.photos[index];

    // Caso 1: A foto já existe no servidor (tem ID)
    if (photo.id) {
      if (confirm('Deseja realmente excluir esta foto permanentemente?')) {
        this.adegaService.excluirFotoDoBanco(photo.id).subscribe({
          next: () => {
            this.limparSlot(index);
            console.log('Foto removida do servidor');
          },
          error: (err) => console.error('Erro ao excluir foto do banco', err)
        });
      }
    }
    else {
      this.limparSlot(index);
    }
  }

  // Função auxiliar para limpar o slot e liberar memória
  private limparSlot(index: number) {
    const existingUrl = this.photos[index]?.url;
    if (existingUrl && existingUrl.startsWith('blob:')) {
      URL.revokeObjectURL(existingUrl);
    }

    this.photos[index] = {};
    this.photos = [...this.photos];
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
      safra: this.form.value.safra,
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
        this.form.patchValue({
          nomeVinho: vinho.nome,
          vinicola: vinho.vinicola,
          uva: vinho.tipoUva,
          pais: vinho.pais,
          safra: vinho.safra,
          teorAlcoolico: vinho.teorAlcoolico,
          dataConsumo: vinho.dataConsumo,
          harmonizacao: vinho.harmonizacoes ? vinho.harmonizacoes.join(', ') : '',
          comments: vinho.comentario
        });

        this.rating = vinho.avaliacao ?? 0;

        if (vinho.fotos && vinho.fotos.length > 0) {
          this.photos = vinho.fotos.map(f => ({
            id: f.id,
            url: `http://localhost:8080/api/fotos/exibir/${f.arquivoPath}`
          }));

          while (this.photos.length < 3) {
            this.photos.push({});
          }
        } else {
          this.photos = Array.from({ length: 3 }, () => ({}));
        }
      },
      error: (err) => console.error('Erro ao carregar dados do vinho', err)
    });
  }
}
