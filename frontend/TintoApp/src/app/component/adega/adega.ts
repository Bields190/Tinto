import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, computed, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, Subscription, catchError, debounceTime, finalize, of } from 'rxjs';
import { AdegaService, AdegaVinho } from '../../service/adega.service';

@Component({
  selector: 'app-adega',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './adega.html',
  styleUrl: './adega.scss',
})
export class Adega implements OnInit, OnDestroy {
  protected readonly fallbackImage = 'assets/img/Logo - Areia.png';

  // --- SINAIS DE ESTADO UI ---
  protected readonly carregando = signal(true);
  protected readonly erroCarregamento = signal(false);
  protected readonly mostrarFiltros = signal(false);
  protected readonly vinhos = signal<AdegaVinho[]>([]);

  // --- SINAIS DE FILTRO ---
  protected readonly termoBusca = signal('');
  protected readonly somenteFavoritos = signal(false);
  protected readonly filtroSafra = signal<number | null>(null);
  protected readonly filtroTeor = signal<number | null>(null);
  protected readonly filtroData = signal<string | null>(null);
  protected readonly filtroAvaliacao = signal<number | null>(null);
  

  private readonly adegaService = inject(AdegaService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly buscaSubject = new Subject<void>();
  private buscaSubscription?: Subscription;

  protected readonly vinhosFiltrados = computed(() => this.vinhos());

  protected readonly listaVazia = computed(
    () => !this.carregando() && !this.erroCarregamento() && this.vinhos().length === 0 && !this.temFiltroAtivo()
  );

  protected readonly buscaSemResultado = computed(
    () => !this.carregando() && this.vinhos().length === 0 && this.temFiltroAtivo()
  );
  

  constructor() {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.buscaSubscription = this.buscaSubject.pipe(
        debounceTime(400)
      ).subscribe(() => {
        this.executarBuscaNoServidor();
      });

      // Carregamento inicial
      this.executarBuscaNoServidor();
    }
  }

  ngOnDestroy(): void {
    this.buscaSubscription?.unsubscribe();
  }

  private temFiltroAtivo(): boolean {
    return this.termoBusca() !== '' || 
           this.filtroSafra() !== null || 
           this.filtroTeor() !== null || 
           this.filtroData() !== null || 
           this.filtroAvaliacao() !== null;
  }

  // --- AÇÕES DE FILTRAGEM ---

  protected atualizarBusca(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    this.termoBusca.set(input.value);
    this.buscaSubject.next();
  }

  protected alternarFavoritos(): void {
    this.somenteFavoritos.update((valor) => !valor);
    this.buscaSubject.next();
  }

  protected alternarPainelFiltros(): void {
    this.mostrarFiltros.update((v) => !v);
  }

  protected definirAvaliacao(estrelas: number): void {
    if (this.filtroAvaliacao() === estrelas) {
      this.filtroAvaliacao.set(null);
    } else {
      this.filtroAvaliacao.set(estrelas);
    }
    this.buscaSubject.next();
  }

  protected atualizarTeor(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const valor = input.value ? parseFloat(input.value) : null;
    this.filtroTeor.set(valor);
    this.buscaSubject.next();
  }

  protected dispararBusca(): void {
    this.buscaSubject.next();
  }

  protected limparBusca(): void {
    this.termoBusca.set('');
    this.filtroSafra.set(null);
    this.filtroTeor.set(null);
    this.filtroData.set(null);
    this.filtroAvaliacao.set(null);
    this.somenteFavoritos.set(false);
    this.buscaSubject.next();
  }

  // --- COMUNICAÇÃO COM A API ---

  private executarBuscaNoServidor(): void {
  this.carregando.set(true);
  this.erroCarregamento.set(false);

  const clean = (val: any) => (val === null || val === '' ? undefined : val);

  const filtros = {
    termo: clean(this.termoBusca()),
    isFavorito: this.somenteFavoritos() ? true : undefined,
    safra: clean(this.filtroSafra()),
    teorAlcoolico: clean(this.filtroTeor()),
    dataConsumo: clean(this.filtroData()),
    avaliacao: clean(this.filtroAvaliacao())
  };

  this.adegaService
    .buscarVinhos(filtros)
    .pipe(
      catchError(() => {
        this.erroCarregamento.set(true);
        return of([]);
      }),
      finalize(() => this.carregando.set(false)),
    )
    .subscribe((vinhos) => {
      this.vinhos.set(vinhos);
    });
}

  // --- MÉTODOS VISUAIS E ROTAS ---

  protected imagemDoVinho(vinho: AdegaVinho): string {
  if (vinho.urlCapa) {
    return vinho.urlCapa;
  }
  return `http://localhost:8080/api/fotos/capa/${vinho.id}`;
}

  protected tratarErroImagem(evento: Event): void {
    const imagem = evento.target as HTMLImageElement;
    imagem.src = this.fallbackImage;
  }

  protected estrelas(avaliacao: number | null | undefined): number[] {
    return Array.from({ length: Math.max(avaliacao ?? 0, 0) }, (_, i) => i);
  }

  protected trackByVinhoId(_: number, vinho: AdegaVinho): number {
    return vinho.id;
  }

  protected abrirDetalhes(vinho: AdegaVinho): void {
    this.router.navigate(['/vinhos', vinho.id]);
  }

  protected sair(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/inicio']);
  }
}