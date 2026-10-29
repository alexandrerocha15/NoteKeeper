import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  listar(): Observable<Nota[]> {
    const token = this.auth.obterToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token ?? ''}`,
    });

    return this.http.get<Nota[]>(this.apiUrl, { headers });
  }
}
