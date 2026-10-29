import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../auth';

@Component({
  selector: 'app-cadastro',
  imports: [FormsModule, RouterLink],
  templateUrl: './cadastro.html',
})
export class Cadastro {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  nome = '';
  email = '';
  senha = '';
  confirmarSenha = '';

  carregando = signal(false);
  erro = signal('');

  cadastrar(): void {
    if (!this.nome.trim() || !this.email.trim() || !this.senha) {
      this.erro.set('Preencha todos os campos.');
      return;
    }

    if (this.senha !== this.confirmarSenha) {
      this.erro.set('As senhas não coincidem.');
      return;
    }

    this.carregando.set(true);
    this.erro.set('');

    this.auth.cadastrar({
      nome: this.nome.trim(),
      email: this.email.trim(),
      senha: this.senha,
    }).subscribe({
      next: () => {
        this.carregando.set(false);
        this.router.navigateByUrl('/login');
      },
      error: () => {
        this.erro.set('Não foi possível realizar o cadastro.');
        this.carregando.set(false);
      },
    });
  }
}
