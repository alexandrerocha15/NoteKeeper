import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Auth } from '../auth/auth';

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
  private readonly apiUrl = 'http://localhost:5146/categorias';

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
  
}
