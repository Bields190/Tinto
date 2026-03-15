import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.scss',
})
export class Cadastro {
  cadastroForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router
  ) {
    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      dataNascimento: ['', [Validators.required]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]]
    }, { validators: this.senhasIguais });
  }

  // Validador customizado para comparar as senhas
  senhasIguais(group: FormGroup) {
    const senha = group.get('senha')?.value;
    const confirma = group.get('confirmarSenha')?.value;
    return senha === confirma ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.cadastroForm.valid) {
      // Criamos uma cópia dos dados e removemos o 'confirmarSenha' antes de enviar
      const { confirmarSenha, ...dadosParaEnviar } = this.cadastroForm.value;

      this.authService.cadastrar(dadosParaEnviar).subscribe({
        next: (res) => {
          console.log('Sucesso:', res);
          alert('Cadastro realizado com sucesso!');
          this.router.navigate(['/login']); // Redireciona para o login
        },
        error: (err) => {
          console.error('Erro no cadastro:', err);
          alert('Erro ao cadastrar usuário. Verifique os dados.');
        }
      });
    }
  }
}