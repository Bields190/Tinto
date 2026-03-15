import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/usuarios';

  validarSenha(senhaAtual: string): Observable<any> {
  return this.http.post(`${this.API_URL}/validar?senhaAtual=${senhaAtual}`, {}, { responseType: 'text' });
}

  atualizarNome(senhaAtual: string, novoNome: string): Observable<any> {
  return this.http.put(`${this.API_URL}/alterar/nome?senhaAtual=${senhaAtual}&novoNome=${novoNome}`, {});
}

atualizarEmail(senhaAtual: string, novoEmail: string): Observable<any> {
  return this.http.put(`${this.API_URL}/alterar/email?senhaAtual=${senhaAtual}&novoEmail=${novoEmail}`, {});
}

atualizarPerfil(senhaAtual: string, dados: any): Observable<any> {
  return this.http.put(`${this.API_URL}/alterar/nome?senhaAtual=${senhaAtual}&novoNome=${dados.nome}`, {});
}

atualizarSenha(senhaAtual: string, novaSenha: string): Observable<any> {
  return this.http.put(`${this.API_URL}/alterar/senha?senhaAtual=${senhaAtual}&novaSenha=${novaSenha}`, {});
}
}