import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdegaVinho {
  id: number;
  nome: string;
  pais: string | null;
  avaliacao: number | null;
  urlCapa?: string | null;
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
    return this.http.get<AdegaVinho[]>(`${this.apiUrl}/grid`);
  }

  buscarVinhoPorId(id: number): Observable<VinhoDetalhe> {
    return this.http.get<VinhoDetalhe>(`${this.apiUrl}/${id}`);
  }

  atualizarVinho(id: string, vinho: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, vinho);
  }

  registrarVinho(vinho: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar`, vinho);
  }

  uploadFotos(vinhoId: number, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => formData.append('fotos', file));

    return this.http.post(`${this.apiUrl}/${vinhoId}/upload-fotos`, formData);
  }

  buscarVinhos(filtros: {
    termo?: string;
    isFavorito?: boolean;
    safra?: number;
    teorAlcoolico?: number;
    dataConsumo?: string;
    avaliacao?: number;
  }): Observable<AdegaVinho[]> {
    let params = new HttpParams();

    if (filtros.termo) params = params.set('termo', filtros.termo);
    if (filtros.isFavorito != null) params = params.set('isFavorito', filtros.isFavorito.toString());
    if (filtros.safra != null) params = params.set('safra', filtros.safra.toString());
    if (filtros.teorAlcoolico != null) params = params.set('teorAlcoolico', filtros.teorAlcoolico.toString());
    if (filtros.dataConsumo) params = params.set('dataConsumo', filtros.dataConsumo);
    if (filtros.avaliacao != null) params = params.set('avaliacao', filtros.avaliacao.toString());

    return this.http.get<AdegaVinho[]>(`${this.apiUrl}/buscar`, { params });
  }

  excluirVinho(id: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/api/vinhos/${id}`);
  }

  excluirFotoDoBanco(fotoId: number): Observable<any> {
  return this.http.delete(`http://localhost:8080/api/fotos/${fotoId}`);
}
}
