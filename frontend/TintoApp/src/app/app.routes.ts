import { Routes } from '@angular/router';
import { LandingPage } from './component/landing-page/landing-page';
import { Cadastro } from './component/cadastro/cadastro';
import { Login } from './component/login/login';
import { Perfil } from './component/perfil/perfil';
import { Adicionar } from './component/adicionar/adicionar';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: LandingPage },
  { path: 'cadastro', component: Cadastro },
  { path: 'login', component: Login },
  { path: 'perfil', component: Perfil },
  { path: 'adicionar', component: Adicionar }
];
