import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../service/usuario.service';
import { jwtDecode } from 'jwt-decode';
import { ChangeDetectorRef } from '@angular/core'; 

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.scss'],
})
export class Perfil implements OnInit {
  perfilForm: FormGroup;
  senhaConfirmForm: FormGroup;
  modoEdicao = false;
  showSenhaConfirmModal = false;
  erroSenha = '';
  dataFormatada: string = 'Carregando...';
  dadosOriginais: any = {};
  
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.perfilForm = this.fb.group({
      nome: [{value: '', disabled: true}],
      email: [{value: '', disabled: true}],
      dataNascimento: [{value: '', disabled: true}],
      novaSenha: [{value: '', disabled: true}] // Campo adicionado
    });
    
    this.senhaConfirmForm = this.fb.group({
      confirmSenha: ['', Validators.required],
    });
  }

  ngOnInit() {
  this.carregarDadosDoBanco();
}

  habilitarEdicao() {
    this.erroSenha = '';
    this.senhaConfirmForm.reset();
    this.showSenhaConfirmModal = true;
  }

  desabilitarInputs() {
    this.perfilForm.disable();
    this.modoEdicao = false;
  }

  carregarDadosDoToken() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.perfilForm.patchValue({
          nome: decoded.nome,
          email: decoded.sub 
          // Se tiver a data no token, coloque aqui também
        });
        
        // Guarda como o usuário era ANTES de editar
        this.dadosOriginais = this.perfilForm.getRawValue();
      } catch (error) {
        console.error("Erro ao decodificar token", error);
      }
    }
  }

  confirmarSenha() {
    const confirmSenha = this.senhaConfirmForm.value.confirmSenha;

    if (!confirmSenha) {
      this.erroSenha = 'Digite a senha para confirmar.';
      return;
    }

    this.usuarioService.validarSenha(confirmSenha).subscribe({
      next: () => {
        this.erroSenha = '';
        this.showSenhaConfirmModal = false;
        this.modoEdicao = true;
        this.perfilForm.enable();
        // A data de nascimento normalmente não muda, então mantemos bloqueada
        this.perfilForm.get('dataNascimento')?.disable(); 
      },
      error: () => {
        this.erroSenha = 'Senha incorreta.';
      }
    });
  }

  cancelarConfirmacao() {
    this.erroSenha = '';
    this.showSenhaConfirmModal = false;
  }

  salvarEdicao() {
    const dadosNovos = this.perfilForm.getRawValue();
    const senhaAtual = this.senhaConfirmForm.value.confirmSenha;

    let alterouAlgo = false;

    // 1. Verifica se alterou o NOME
    if (dadosNovos.nome !== this.dadosOriginais.nome) {
      alterouAlgo = true;
      this.usuarioService.atualizarNome(senhaAtual, dadosNovos.nome).subscribe({
        next: (res: any) => {
          if (res.token) localStorage.setItem('token', res.token);
          this.dadosOriginais.nome = dadosNovos.nome; // Atualiza a base
        },
        error: (err) => alert('Erro ao alterar nome: ' + err.error)
      });
    }

    // 2. Verifica se alterou o EMAIL
    if (dadosNovos.email !== this.dadosOriginais.email) {
      alterouAlgo = true;
      this.usuarioService.atualizarEmail(senhaAtual, dadosNovos.email).subscribe({
        next: (res: any) => {
          if (res.token) localStorage.setItem('token', res.token);
          this.dadosOriginais.email = dadosNovos.email; // Atualiza a base
        },
        error: (err) => alert('Erro ao alterar email: ' + err.error)
      });
    }

    // 3. Verifica se quer alterar a SENHA (se o campo não estiver vazio)
    if (dadosNovos.novaSenha && dadosNovos.novaSenha.trim() !== '') {
      alterouAlgo = true;
      // Precisamos adicionar esse método no UsuarioService depois!
      this.usuarioService.atualizarSenha(senhaAtual, dadosNovos.novaSenha).subscribe({
        next: () => {
          this.perfilForm.patchValue({ novaSenha: '' }); // Limpa o campo
        },
        error: (err) => alert('Erro ao alterar senha: ' + err.error)
      });
    }

    if (alterouAlgo) {
      alert('Alterações solicitadas com sucesso!');
    } else {
      alert('Nenhuma alteração foi feita.');
    }

    this.desabilitarInputs();
  }

  voltar() {
    this.router.navigate(['/adega']);
  }

  carregarDadosDoBanco() {
  this.usuarioService.obterPerfil().subscribe({
    next: (user) => {
      if (user.dataNascimento) {
        const partes = user.dataNascimento.split('-'); // [2000, 12, 31]
        this.dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
        this.cdr.detectChanges();
      }
      
      this.perfilForm.patchValue({
        nome: user.nome,
        email: user.email,
        dataNascimento: user.dataNascimento
      });

      this.dadosOriginais = this.perfilForm.getRawValue();
    },
    error: (err) => console.error("Erro ao buscar dados do banco", err)
  });
}
}