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

@Injectable({
  providedIn: 'root',
})
export class AdegaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/vinhos';

  listarMeusVinhos(): Observable<AdegaVinho[]> {
    return this.http.get<AdegaVinho[]>(`${this.apiUrl}/meus-vinhos`);
  }
}
