import { Component, inject, OnInit, signal } from '@angular/core';
import { Nota, Notas } from '../notas';
import { Categoria, Categorias } from '../../categorias/categorias';

@Component({
  selector: 'app-listagem-notas',
  templateUrl: './listagem.html',
  styleUrl: './listagem.scss',
})
export class Listagem implements OnInit {
  private readonly notasService = inject(Notas);
  private readonly categoriasService = inject(Categorias);

  notas = signal<Nota[]>([]);
  categorias = signal<Categoria[]>([]);

  carregando = signal(true);
  erro = signal('');

  exibirFormulario = signal(false);
  titulo = signal('');
  descricao = signal('');
  categoriasSelecionadas = signal<string[]>([]);
  salvando = signal(false);
  erroCadastro = signal('');

  ngOnInit(): void {
    this.carregarNotas();
    this.carregarCategorias();
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

  carregarCategorias(): void {
    this.categoriasService.listar().subscribe({
      next: (categorias) => this.categorias.set(categorias),
      error: () => {
        this.erroCadastro.set('Não foi possível carregar as categorias.');
      },
    });
  }

  alternarCategoria(id: string, selecionada: boolean): void {
    this.categoriasSelecionadas.update((ids) =>
      selecionada ? [...ids, id] : ids.filter((item) => item !== id)
    );
  }

  cancelarFormulario(): void {
    this.exibirFormulario.set(false);
    this.titulo.set('');
    this.descricao.set('');
    this.categoriasSelecionadas.set([]);
    this.erroCadastro.set('');
  }

  cadastrarNota(): void {
    const titulo = this.titulo().trim();
    const descricao = this.descricao().trim();

    if (titulo.length < 2 || titulo.length > 100) {
      this.erroCadastro.set('O título deve ter entre 2 e 100 caracteres.');
      return;
    }

    if (descricao.length > 300) {
      this.erroCadastro.set('A descrição deve ter no máximo 300 caracteres.');
      return;
    }

    this.salvando.set(true);
    this.erroCadastro.set('');

    this.notasService
      .cadastrar(titulo, descricao, this.categoriasSelecionadas())
      .subscribe({
        next: () => {
          this.salvando.set(false);
          this.cancelarFormulario();
          this.carregarNotas();
        },
        error: () => {
          this.erroCadastro.set(
            'Não foi possível cadastrar a nota. Verifique se o título já existe.'
          );
          this.salvando.set(false);
        },
      });
  }
}
