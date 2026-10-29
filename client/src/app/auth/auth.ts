import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CadastroRequest {
  nome: string;
  email: string;
  senha: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  usuarioId: string;
  nome: string;
  email: string;
  accessToken: string;
  dataExpiracaoEmUtc: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5146/auth';

  cadastrar(dados: CadastroRequest): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/cadastro`, dados);
  }

  login(dados: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, dados);
  }

  salvarToken(token: string): void {
    sessionStorage.setItem('notekeeper_token', token);
  }

  obterToken(): string | null {
    return sessionStorage.getItem('notekeeper_token');
  }

  estaAutenticado(): boolean {
    return !!this.obterToken();
  }

  sair(): void {
    sessionStorage.removeItem('notekeeper_token');
  }
}
