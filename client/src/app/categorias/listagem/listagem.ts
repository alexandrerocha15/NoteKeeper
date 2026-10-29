import { Component, inject, OnInit, signal } from '@angular/core';
import { Categoria, Categorias } from '../categorias';

@Component({
  selector: 'app-listagem-categorias',
  templateUrl: './listagem.html',
  styleUrl: './listagem.scss',
})
export class Listagem implements OnInit {
  private readonly categoriasService = inject(Categorias);
  categoriaEmEdicao = signal<Categoria | null>(null);
  excluindoId = signal<string | null>(null);

  categorias = signal<Categoria[]>([]);
  carregando = signal(true);
  erro = signal('');

  exibirFormulario = signal(false);
  tituloNovaCategoria = signal('');
  salvando = signal(false);
  erroCadastro = signal('');

  ngOnInit(): void {
    this.carregarCategorias();
  }

  carregarCategorias(): void {
    this.carregando.set(true);
    this.erro.set('');

    this.categoriasService.listar().subscribe({
      next: (categorias) => {
        this.categorias.set(categorias);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar as categorias.');
        this.carregando.set(false);
      },
    });
  }

  cadastrarCategoria(): void {
    const titulo = this.tituloNovaCategoria().trim();

    if (titulo.length < 2 || titulo.length > 100) {
      this.erroCadastro.set('O título deve ter entre 2 e 100 caracteres.');
      return;
    }

    this.salvando.set(true);
    this.erroCadastro.set('');

    this.categoriasService.cadastrar(titulo).subscribe({
      next: () => {
        this.tituloNovaCategoria.set('');
        this.exibirFormulario.set(false);
        this.salvando.set(false);
        this.carregarCategorias();
      },
      error: () => {
        this.erroCadastro.set(
          'Não foi possível cadastrar a categoria. Verifique se o título já existe.',
        );
        this.salvando.set(false);
      },
    });
  }

  iniciarEdicao(categoria: Categoria): void {
    this.categoriaEmEdicao.set(categoria);
    this.tituloNovaCategoria.set(categoria.titulo);
    this.erroCadastro.set('');
    this.exibirFormulario.set(true);
  }

  cancelarFormulario(): void {
    this.exibirFormulario.set(false);
    this.categoriaEmEdicao.set(null);
    this.tituloNovaCategoria.set('');
    this.erroCadastro.set('');
  }

  salvarCategoria(): void {
    const categoria = this.categoriaEmEdicao();

    if (categoria) {
      this.editarCategoria(categoria.id);
    } else {
      this.cadastrarCategoria();
    }
  }

  editarCategoria(id: string): void {
    const titulo = this.tituloNovaCategoria().trim();

    if (titulo.length < 2 || titulo.length > 100) {
      this.erroCadastro.set('O título deve ter entre 2 e 100 caracteres.');
      return;
    }

    this.salvando.set(true);
    this.erroCadastro.set('');

    this.categoriasService.editar(id, titulo).subscribe({
      next: () => {
        this.salvando.set(false);
        this.cancelarFormulario();
        this.carregarCategorias();
      },
      error: () => {
        this.erroCadastro.set('Não foi possível editar a categoria.');
        this.salvando.set(false);
      },
    });
  }

  excluirCategoria(categoria: Categoria): void {
    if (!confirm(`Deseja realmente excluir a categoria "${categoria.titulo}"?`)) {
      return;
    }

    this.excluindoId.set(categoria.id);

    this.categoriasService.excluir(categoria.id).subscribe({
      next: () => {
        this.excluindoId.set(null);
        this.carregarCategorias();
      },
      error: () => {
        this.excluindoId.set(null);
        this.erro.set('Não foi possível excluir a categoria.');
      },
    });
  }
}
