import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { AdegaService, VinhoDetalhe } from '../../service/adega.service';

@Component({
  selector: 'app-detalhes-vinho',
  imports: [CommonModule, RouterModule],
  templateUrl: './detalhes-vinho.html',
  styleUrl: './detalhes-vinho.scss',
})
export class DetalhesVinho {
  protected readonly fallbackImage = 'assets/img/Logo - Areia.png';
  protected readonly carregando = signal(true);
  protected readonly erro = signal(false);
  protected readonly salvandoFavorito = signal(false);
  protected readonly vinho = signal<VinhoDetalhe | null>(null);
  protected readonly indiceFotoAtual = signal(0);

  private readonly adegaService = inject(AdegaService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly fotos = computed(() => {
    const vinho = this.vinho();

    if (!vinho) {
      return [this.fallbackImage];
    }

    const fotosDoRegistro = (vinho.fotos ?? [])
      .map((foto) => this.montarUrlFoto(foto.arquivoPath))
      .filter((url): url is string => !!url);

    if (fotosDoRegistro.length > 0) {
      return fotosDoRegistro;
    }

    return vinho.fotoUrl ? [vinho.fotoUrl] : [this.fallbackImage];
  });

  protected readonly fotoAtual = computed(() => {
    const lista = this.fotos();

    if (lista.length === 0) {
      return this.fallbackImage;
    }

    const indice = this.indiceNormalizado(lista.length);
    return lista[indice];
  });

  protected readonly tituloFavorito = computed(() => {
    const favorito = this.vinho()?.isFavorito;
    return favorito ? 'Desfavoritar' : 'Favoritar';
  });

  protected readonly estrelasPreenchidas = computed(() => {
    const nota = Math.max(0, Math.min(5, this.vinho()?.avaliacao ?? 0));
    return Array.from({ length: nota }, (_, indice) => indice);
  });

  protected readonly estrelasVazias = computed(() => {
    const nota = Math.max(0, Math.min(5, this.vinho()?.avaliacao ?? 0));
    return Array.from({ length: 5 - nota }, (_, indice) => indice);
  });

  protected readonly vinicolaTexto = computed(() => this.vinho()?.vinicola || 'Nao informada');
  protected readonly tipoUvaTexto = computed(() => this.vinho()?.tipoUva || 'Nao informado');
  protected readonly teorAlcoolicoTexto = computed(() => this.formatarTeorAlcoolico(this.vinho()?.teorAlcoolico));
  protected readonly dataConsumoTexto = computed(() => this.formatarData(this.vinho()?.dataConsumo));
  protected readonly harmonizacoesTexto = computed(() => {
    const harmonizacoes = this.vinho()?.harmonizacoes ?? [];
    return harmonizacoes.length > 0 ? harmonizacoes.join(', ') : 'Nao informadas';
  });
  protected readonly comentarioTexto = computed(() => this.vinho()?.comentario || 'Sem comentarios ainda');

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      this.carregando.set(false);
      return;
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!idParam || Number.isNaN(id)) {
      this.carregando.set(false);
      this.erro.set(true);
      return;
    }

    this.carregarVinho(id);
  }

  protected voltar(): void {
    this.router.navigate(['/adega']);
  }

  protected editarVinho(): void {
    const vinho = this.vinho();

    if (!vinho) {
      return;
    }

    this.router.navigate(['/adicionar'], {
      state: {
        vinhoId: vinho.id,
        vinho,
        origem: 'detalhes-vinho',
      },
    });
  }

  protected alternarFavorito(): void {
    const vinhoAtual = this.vinho();

    if (!vinhoAtual || this.salvandoFavorito()) {
      return;
    }

    const vinhoAtualizado: VinhoDetalhe = {
      ...vinhoAtual,
      isFavorito: !vinhoAtual.isFavorito,
    };

    this.salvandoFavorito.set(true);

    this.adegaService
      .atualizarVinho(vinhoAtual.id, vinhoAtualizado)
      .pipe(finalize(() => this.salvandoFavorito.set(false)))
      .subscribe({
        next: (vinho) => this.vinho.set(vinho),
        error: () => {
          this.vinho.set(vinhoAtual);
        },
      });
  }

  protected fotoAnterior(): void {
    const total = this.fotos().length;
    if (total <= 1) {
      return;
    }

    this.indiceFotoAtual.update((indice) => (indice - 1 + total) % total);
  }

  protected proximaFoto(): void {
    const total = this.fotos().length;
    if (total <= 1) {
      return;
    }

    this.indiceFotoAtual.update((indice) => (indice + 1) % total);
  }

  protected tratarErroImagem(evento: Event): void {
    const imagem = evento.target as HTMLImageElement;

    if (!imagem.src.includes('Logo%20-%20Areia.png')) {
      imagem.src = this.fallbackImage;
    }
  }

  private carregarVinho(id: number): void {
    this.carregando.set(true);
    this.erro.set(false);

    this.adegaService
      .buscarVinhoPorId(id)
      .pipe(
        catchError(() => {
          this.erro.set(true);
          return of(null);
        }),
        finalize(() => this.carregando.set(false)),
      )
      .subscribe((vinho) => {
        if (!vinho) {
          return;
        }

        this.vinho.set(vinho);
      });
  }

  private indiceNormalizado(total: number): number {
    const indice = this.indiceFotoAtual();
    if (indice < total) {
      return indice;
    }

    this.indiceFotoAtual.set(0);
    return 0;
  }

  private montarUrlFoto(arquivoPath: string | null | undefined): string | null {
    if (!arquivoPath) {
      return null;
    }

    return `http://localhost:8080/uploads/${arquivoPath}`;
  }

  private formatarTeorAlcoolico(teor: number | null | undefined): string {
    if (teor == null) {
      return 'Nao informado';
    }

    const percentual = Number.isInteger(teor) ? teor.toString() : teor.toFixed(1).replace('.', ',');
    return `${percentual}%`;
  }

  private formatarData(data: string | null | undefined): string {
    if (!data) {
      return 'Nao informada';
    }

    const [ano, mes, dia] = data.split('-');
    if (!ano || !mes || !dia) {
      return data;
    }

    return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`;
  }
}
