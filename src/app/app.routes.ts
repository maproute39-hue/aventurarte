import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Contacto } from './pages/contacto/contacto';
import { Destinos } from './pages/destinos/destinos';
export const routes: Routes = [
  { path: '', component: Home },
  { path: 'contacto', component: Contacto },
  { path: 'destinos', component: Destinos }


];
