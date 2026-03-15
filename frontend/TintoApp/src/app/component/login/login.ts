import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm: FormGroup;

  showEsqueciSenhaModal = false;
  esqueceuEmail = '';
  codigo = '';
  emailDeVerificacao = '';
  etapaEsqueciSenha: 1 | 2 = 1;
  erroEsqueciSenha = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, senha } = this.loginForm.value;
      
      this.authService.login(email, senha).subscribe({
        next: (token) => {
          console.log('Login realizado! Token salvo.');
          this.router.navigate(['/adega']);
        },
        error: (err) => {
          console.error('Erro no login', err);
          alert('Email ou senha inválidos');
        }
      });
    }
  }

  abrirModalEsqueciSenha(event: MouseEvent) {
    event.preventDefault();
    this.showEsqueciSenhaModal = true;
    this.etapaEsqueciSenha = 1;
    this.erroEsqueciSenha = '';
    this.esqueceuEmail = '';
    this.codigo = '';
  }

  fecharModalEsqueciSenha() {
    this.showEsqueciSenhaModal = false;
    this.erroEsqueciSenha = '';
  }

  enviarEmailParaRedefinicao() {
    if (!this.esqueceuEmail) {
      this.erroEsqueciSenha = 'Digite o email cadastrado.';
      return;
    }

    this.authService.esqueciSenha(this.esqueceuEmail).subscribe({
      next: () => {
        this.etapaEsqueciSenha = 2;
        this.emailDeVerificacao = this.esqueceuEmail;
        this.erroEsqueciSenha = '';
        alert('Código enviado. Verifique o email e digite abaixo.');
      },
      error: (err) => {
        console.error('Erro no pedido de redefinição', err);
        this.erroEsqueciSenha = 'Não foi possível solicitar o código. Verifique o email.';
      }
    });
  }

  verificarCodigoEsqueciSenha() {
    if (!this.codigo) {
      this.erroEsqueciSenha = 'Digite o código recebido no email.';
      return;
    }

    this.authService.verificarCodigo(this.emailDeVerificacao, this.codigo).subscribe({
      next: (valido) => {
        if (valido) {
          localStorage.setItem('redefinirEmail', this.emailDeVerificacao);
          localStorage.setItem('redefinirCodigo', this.codigo);
          this.fecharModalEsqueciSenha();
          this.router.navigate(['/alterar']);
        } else {
          this.erroEsqueciSenha = 'Código inválido. Tente novamente.';
        }
      },
      error: (err) => {
        console.error('Erro na verificação de código', err);
        this.erroEsqueciSenha = 'Erro ao verificar código. Tente novamente.';
      }
    });
  }
}