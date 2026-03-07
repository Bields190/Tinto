import { Routes } from '@angular/router';
import { LandingPage } from './component/landing-page/landing-page';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: LandingPage }
];
