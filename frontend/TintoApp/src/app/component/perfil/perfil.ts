import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil implements OnInit {
  perfilForm: FormGroup;
  senhaConfirmForm: FormGroup;
  modoEdicao = false;
  showSenhaConfirmModal = false;
  senhaAtual = 'onanista';
  erroSenha = '';

  constructor(private fb: FormBuilder, private router: Router) {
    this.perfilForm = this.fb.group({
      nome: ['Khalil Brito'],
      email: ['khalildbrito@gmail.com'],
      senha: ['onanista'],
      dataNascimento: [''],
    });

    this.senhaConfirmForm = this.fb.group({
      confirmSenha: [''],
    });
  }

  ngOnInit() {
    this.desabilitarInputs();
  }

  habilitarEdicao() {
    this.erroSenha = '';
    this.senhaConfirmForm.reset();
    this.showSenhaConfirmModal = true;
  }

  confirmarSenha() {
    const confirmSenha = this.senhaConfirmForm.value.confirmSenha;

    if (!confirmSenha) {
      this.erroSenha = 'Digite a senha para confirmar.';
      return;
    }

    if (confirmSenha !== this.senhaAtual) {
      this.erroSenha = 'Senha incorreta. A edição não foi liberada.';
      return;
    }

    this.erroSenha = '';
    this.showSenhaConfirmModal = false;
    this.modoEdicao = true;
    this.perfilForm.enable();
  }

  cancelarConfirmacao() {
    this.erroSenha = '';
    this.showSenhaConfirmModal = false;
  }

  salvarEdicao() {
    if (this.perfilForm.valid) {
      this.modoEdicao = false;
      this.perfilForm.disable();
      this.senhaAtual = this.perfilForm.value.senha || this.senhaAtual;
      console.log('Dados salvos:', this.perfilForm.value);
    }
  }

  desabilitarInputs() {
    this.perfilForm.disable();
  }

  voltar() {
    this.router.navigate(['/adega']);
  }
}
