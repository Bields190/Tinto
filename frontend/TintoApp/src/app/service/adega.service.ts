import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdegaVinho {
  id: number;
  nome: string;
  pais: string | null;
  avaliacao: number | null;
  fotoUrl?: string | null;
  isFavorito?: boolean | null;
}

export interface FotoVinhoDetalhe {
  id: number;
  arquivoPath: string;
}

export interface VinhoDetalhe extends AdegaVinho {
  vinicola: string | null;
  safra: number | null;
  teorAlcoolico: number | null;
  tipoUva: string | null;
  dataConsumo: string | null;
  comentario: string | null;
  harmonizacoes: string[] | null;
  fotos: FotoVinhoDetalhe[] | null;
}

@Injectable({
  providedIn: 'root',
})
export class AdegaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/vinhos';

  listarMeusVinhos(): Observable<AdegaVinho[]> {
    return this.http.get<AdegaVinho[]>(`${this.apiUrl}/meus-vinhos`);
  }

  buscarVinhoPorId(id: number): Observable<VinhoDetalhe> {
    return this.http.get<VinhoDetalhe>(`${this.apiUrl}/${id}`);
  }

  atualizarVinho(id: number, vinho: VinhoDetalhe): Observable<VinhoDetalhe> {
    return this.http.put<VinhoDetalhe>(`${this.apiUrl}/${id}`, vinho);
  }
}
