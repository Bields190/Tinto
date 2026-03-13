import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  cadastrar(usuario: any): Observable<any> {
    return this.http.post(`${this.API_URL}/usuarios/cadastrar`, usuario);
  }
  
  login(email: string, senha: string): Observable<string> {
  localStorage.removeItem('token'); 
  
  return this.http.post(`${this.API_URL}/auth/login`, { email, senha }, { responseType: 'text' })
    .pipe(
      tap(token => {
        localStorage.setItem('token', token);
      })
    );
}

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLogado(): boolean {
    return !!this.getToken();
  }
}