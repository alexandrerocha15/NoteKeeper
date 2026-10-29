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
  categoriasFiltro = signal<string[]>([]);

  carregando = signal(true);
  erro = signal('');

  exibirFormulario = signal(false);
  notaEmEdicao = signal<Nota | null>(null);

  titulo = signal('');
  descricao = signal('');
  categoriasSelecionadas = signal<string[]>([]);

  salvando = signal(false);
  excluindoId = signal<string | null>(null);
  alterandoStatusId = signal<string | null>(null);
  erroCadastro = signal('');
  totalNotas = signal(0);

  ngOnInit(): void {
    this.carregarNotas();
    this.carregarCategorias();
  }

  carregarNotas(): void {
    this.carregando.set(true);
    this.erro.set('');

    this.notasService.listar().subscribe({
      next: (notas) => {
        const filtros = this.categoriasFiltro();
        this.totalNotas.set(notas.length);

        const notasFiltradas =
          filtros.length === 0
            ? notas
            : notas.filter((nota) =>
                (nota.categorias ?? []).some((categoria) => filtros.includes(categoria.id)),
              );

        this.notas.set(notasFiltradas);
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
      selecionada ? [...new Set([...ids, id])] : ids.filter((item) => item !== id),
    );
  }

  iniciarCadastro(): void {
    this.cancelarFormulario();
    this.exibirFormulario.set(true);
  }

  iniciarEdicao(nota: Nota): void {
    this.notaEmEdicao.set(nota);
    this.titulo.set(nota.titulo);
    this.descricao.set(nota.descricao ?? '');
    this.categoriasSelecionadas.set((nota.categorias ?? []).map((categoria) => categoria.id));
    this.erroCadastro.set('');
    this.exibirFormulario.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarFormulario(): void {
    this.exibirFormulario.set(false);
    this.notaEmEdicao.set(null);
    this.titulo.set('');
    this.descricao.set('');
    this.categoriasSelecionadas.set([]);
    this.erroCadastro.set('');
  }

  salvarNota(): void {
    const titulo = this.titulo().trim();
    const descricao = this.descricao().trim();
    const nota = this.notaEmEdicao();

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

    const requisicao = nota
      ? this.notasService.editar(
          nota.id,
          titulo,
          descricao,
          nota.status,
          this.categoriasSelecionadas(),
        )
      : this.notasService.cadastrar(titulo, descricao, this.categoriasSelecionadas());

    requisicao.subscribe({
      next: () => {
        this.salvando.set(false);
        this.cancelarFormulario();
        this.carregarNotas();
      },
      error: () => {
        this.erroCadastro.set('Não foi possível salvar a nota. Verifique se o título já existe.');
        this.salvando.set(false);
      },
    });
  }

  alternarStatus(nota: Nota): void {
    const novoStatus = nota.status === 'Ativa' ? 'Arquivada' : 'Ativa';

    this.alterandoStatusId.set(nota.id);
    this.erro.set('');

    this.notasService
      .editar(
        nota.id,
        nota.titulo,
        nota.descricao ?? '',
        novoStatus,
        (nota.categorias ?? []).map((categoria) => categoria.id),
      )
      .subscribe({
        next: () => {
          this.alterandoStatusId.set(null);
          this.carregarNotas();
        },
        error: () => {
          this.alterandoStatusId.set(null);
          this.erro.set('Não foi possível alterar o status da nota.');
        },
      });
  }

  excluirNota(nota: Nota): void {
    if (!confirm(`Deseja realmente excluir a nota "${nota.titulo}"?`)) {
      return;
    }

    this.excluindoId.set(nota.id);
    this.erro.set('');

    this.notasService.excluir(nota.id).subscribe({
      next: () => {
        this.excluindoId.set(null);
        this.carregarNotas();
      },
      error: () => {
        this.excluindoId.set(null);
        this.erro.set('Não foi possível excluir a nota.');
      },
    });
  }

  alternarFiltroCategoria(id: string, selecionada: boolean): void {
    this.categoriasFiltro.update((ids) =>
      selecionada ? [...new Set([...ids, id])] : ids.filter((item) => item !== id),
    );

    this.carregarNotas();
  }

  limparFiltros(): void {
    this.categoriasFiltro.set([]);
    this.carregarNotas();
  }
}
