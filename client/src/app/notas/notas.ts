import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Auth } from '../auth/auth';

export interface Nota {
  id: string;
  titulo: string;
  descricao: string | null;
  status: string;
  categorias: {
    id: string;
    titulo: string;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class Notas {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(Auth);

  private readonly apiUrl = 'http://localhost:5146/notas';

  listar(categoriaIds: string[] = []): Observable<Nota[]> {
    const token = this.auth.obterToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token ?? ''}`,
    });

    let params = new HttpParams();

    for (const id of categoriaIds) {
      params = params.append('categoriaIds', id);
    }

    return this.http.get<Nota[]>(this.apiUrl, {
      headers,
      params,
    });
  }

  cadastrar(titulo: string, descricao: string, categoriaIds: string[]): Observable<Nota> {
    const token = this.auth.obterToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token ?? ''}`,
    });

    return this.http.post<Nota>(
      this.apiUrl,
      {
        titulo,
        descricao,
        categoriaIds,
      },
      { headers },
    );
  }

  editar(
    id: string,
    titulo: string,
    descricao: string,
    status: string,
    categoriaIds: string[],
  ): Observable<Nota> {
    const token = this.auth.obterToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token ?? ''}`,
    });

    return this.http.put<Nota>(
      `${this.apiUrl}/${id}`,
      {
        titulo,
        descricao,
        status,
        categoriaIds,
      },
      { headers },
    );
  }

  excluir(id: string): Observable<void> {
    const token = this.auth.obterToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token ?? ''}`,
    });

    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}
