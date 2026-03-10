import { Routes } from '@angular/router';
import { LandingPage } from './component/landing-page/landing-page';
import { Cadastro } from './component/cadastro/cadastro';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: LandingPage },
  { path: 'cadastro', component: Cadastro }
];
