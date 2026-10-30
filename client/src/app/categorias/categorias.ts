import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Auth } from '../auth/auth';
import { API_URL } from '../api.config';

export interface Categoria {
  id: string;
  titulo: string;
}

@Injectable({
  providedIn: 'root',
})
export class Categorias {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(Auth);
  private readonly apiUrl = `${API_URL}/categorias`;

  listar(): Observable<Categoria[]> {
    const token = this.auth.obterToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token ?? ''}`,
    });

    return this.http.get<Categoria[]>(this.apiUrl, { headers });
  }

  cadastrar(titulo: string): Observable<Categoria> {
    const token = this.auth.obterToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token ?? ''}`,
    });

    return this.http.post<Categoria>(this.apiUrl, { titulo }, { headers });
  }

  editar(id: string, titulo: string): Observable<Categoria> {
    const token = this.auth.obterToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token ?? ''}`,
    });

    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, { titulo }, { headers });
  }

  excluir(id: string): Observable<void> {
    const token = this.auth.obterToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token ?? ''}`,
    });

    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}
