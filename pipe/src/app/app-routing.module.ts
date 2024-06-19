import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AreaDeTrabalhoComponent } from './pages/area-de-trabalho/area-de-trabalho.component';
import { QuadrosComponent } from './pages/quadros/quadros.component';
import { CadastrosComponent } from './pages/cadastros/cadastros.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'area-de-trabalho/:id', component: AreaDeTrabalhoComponent },
  { path: 'quadros/:id', component: QuadrosComponent },
  { path: 'cadastro', component: CadastrosComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
