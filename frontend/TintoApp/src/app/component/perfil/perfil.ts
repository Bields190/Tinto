import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil implements OnInit {
  perfilForm: FormGroup;
  modoEdicao = false;

  constructor(private fb: FormBuilder) {
    this.perfilForm = this.fb.group({
      nome: ['Khalil Brito'],
      email: ['khalildbrito@gmail.com'],
      senha: [''],
      dataNascimento: [''],
    });
  }

  ngOnInit() {
    this.desabilitarInputs();
  }

  habilitarEdicao() {
    this.modoEdicao = true;
    this.perfilForm.enable();
  }

  salvarEdicao() {
    if (this.perfilForm.valid) {
      this.modoEdicao = false;
      this.perfilForm.disable();
      console.log('Dados salvos:', this.perfilForm.value);
    }
  }

  desabilitarInputs() {
    this.perfilForm.disable();
  }

  voltar() {
    this.modoEdicao = false;
    this.desabilitarInputs();
    this.perfilForm.reset({
      nome: 'Khalil Brito',
      email: 'khalildbrito@gmail.com',
      senha: '',
      dataNascimento: '',
    });
  }
}
