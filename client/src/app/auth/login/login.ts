import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  email = '';
  senha = '';

  carregando = signal(false);
  erro = signal('');

  entrar(): void {
    if (!this.email.trim() || !this.senha) {
      this.erro.set('Informe seu e-mail e sua senha.');
      return;
    }

    this.carregando.set(true);
    this.erro.set('');

    this.auth.login({
      email: this.email,
      senha: this.senha,
    }).subscribe({
      next: (resposta) => {
        this.auth.salvarToken(resposta.token);
        this.carregando.set(false);
        this.router.navigateByUrl('/notas');
      },
      error: () => {
        this.erro.set('Não foi possível entrar. Verifique suas credenciais.');
        this.carregando.set(false);
      },
    });
  }
}
