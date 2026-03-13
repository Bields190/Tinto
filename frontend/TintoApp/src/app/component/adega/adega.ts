import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { AdegaService, AdegaVinho } from '../../service/adega.service';

@Component({
  selector: 'app-adega',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './adega.html',
  styleUrl: './adega.scss',
})
export class Adega {
  protected readonly fallbackImage = 'assets/img/Logo - Areia.png';
  protected readonly termoBusca = signal('');
  protected readonly somenteFavoritos = signal(false);
  protected readonly carregando = signal(true);
  protected readonly erroCarregamento = signal(false);
  protected readonly vinhos = signal<AdegaVinho[]>([]);

  private readonly adegaService = inject(AdegaService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly vinhosFiltrados = computed(() => {
    const termo = this.termoBusca().trim().toLowerCase();
    const somenteFavoritos = this.somenteFavoritos();

    return this.vinhos().filter((vinho) => {
      const favorito = !!vinho.isFavorito;
      const correspondeFavorito = !somenteFavoritos || favorito;
      const correspondeTermo =
        !termo ||
        vinho.nome.toLowerCase().includes(termo) ||
        (vinho.pais ?? '').toLowerCase().includes(termo);

      return correspondeFavorito && correspondeTermo;
    });
  });

  protected readonly listaVazia = computed(
    () => !this.carregando() && !this.erroCarregamento() && this.vinhos().length === 0,
  );

  protected readonly buscaSemResultado = computed(
    () => !this.carregando() && !this.listaVazia() && this.vinhosFiltrados().length === 0,
  );

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.carregarVinhos();
      return;
    }

    this.carregando.set(false);
  }

  protected atualizarBusca(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    this.termoBusca.set(input.value);
  }

  protected alternarFavoritos(): void {
    this.somenteFavoritos.update((valorAtual) => !valorAtual);
  }

 protected imagemDoVinho(vinho: AdegaVinho): string {
  console.log('URL da foto do vinho:', vinho.urlCapa); 
  return vinho.urlCapa || this.fallbackImage;
}

  protected tratarErroImagem(evento: Event): void {
    const imagem = evento.target as HTMLImageElement;

    if (!imagem.src.endsWith('Logo%20-%20Sabugueiro.png') && !imagem.src.endsWith('Logo - Sabugueiro.png')) {
      imagem.src = this.fallbackImage;
    }
  }

  protected estrelas(avaliacao: number | null | undefined): number[] {
    return Array.from({ length: Math.max(avaliacao ?? 0, 0) }, (_, indice) => indice);
  }

  protected trackByVinhoId(_: number, vinho: AdegaVinho): number {
    return vinho.id;
  }

  protected abrirDetalhes(vinho: AdegaVinho): void {
    this.router.navigate(['/vinhos', vinho.id]);
  }

  protected limparBusca(): void {
    this.termoBusca.set('');
  }

  protected sair(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/inicio']);
  }

  private carregarVinhos(): void {
    this.carregando.set(true);
    this.erroCarregamento.set(false);

    this.adegaService
      .listarMeusVinhos()
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

  
}
