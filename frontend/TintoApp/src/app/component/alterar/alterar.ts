import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-alterar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './alterar.html',
  styleUrl: './alterar.scss',
})
export class Alterar implements OnInit {
  alterarForm: FormGroup;
  email: string | null = null;
  codigo: string | null = null;
  erro: string = '';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.alterarForm = this.fb.group({
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmaSenha: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.email = localStorage.getItem('redefinirEmail');
    this.codigo = localStorage.getItem('redefinirCodigo');
    if (!this.email || !this.codigo) {
      this.router.navigate(['/login']);
    }
  }

  onSubmit() {
    if (this.alterarForm.invalid) {
      this.erro = 'Preencha todos os campos corretamente.';
      return;
    }

    const { novaSenha, confirmaSenha } = this.alterarForm.value;

    if (novaSenha !== confirmaSenha) {
      this.erro = 'Senhas não conferem.';
      return;
    }

    if (!this.email || !this.codigo) {
      this.erro = 'Operação inválida. Reinicie o fluxo de recuperação.';
      return;
    }

    this.authService.redefinirSenha(this.email, this.codigo, novaSenha).subscribe({
      next: () => {
        alert('Senha atualizada com sucesso. Faça login com a nova senha.');
        localStorage.removeItem('redefinirEmail');
        localStorage.removeItem('redefinirCodigo');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erro ao redefinir senha', err);
        this.erro = err?.error || 'Falha ao redefinir senha.';
      }
    });
  }
}
