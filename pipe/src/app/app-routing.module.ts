import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AreaDeTrabalhoComponent } from './pages/area-de-trabalho/area-de-trabalho.component';
import { QuadrosComponent } from './pages/quadros/quadros.component';
import { CadastrosComponent } from './pages/cadastros/cadastros.component';
import { AuthGuard } from './services/authGuard';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { AdminGuard } from './services/adminGuard';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'area-de-trabalho/:id', component: AreaDeTrabalhoComponent, canActivate: [AuthGuard] },
  { path: 'quadros/:id', component: QuadrosComponent, canActivate: [AuthGuard] },
  { path: 'create-user', component: CreateUserComponent, canActivate: [AdminGuard] },
  { path: 'cadastro', component: CadastrosComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
