import { Component, inject, OnInit, signal } from '@angular/core';
import { Nota, Notas } from '../notas';

@Component({
  selector: 'app-listagem-notas',
  templateUrl: './listagem.html',
  styleUrl: './listagem.scss',
})
export class Listagem implements OnInit {
  private readonly notasService = inject(Notas);

  notas = signal<Nota[]>([]);
  carregando = signal(true);
  erro = signal('');

  ngOnInit(): void {
    this.carregarNotas();
  }

  carregarNotas(): void {
    this.carregando.set(true);
    this.erro.set('');

    this.notasService.listar().subscribe({
      next: (notas) => {
        this.notas.set(notas);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar as notas.');
        this.carregando.set(false);
      },
    });
  }
}
