import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AreaDeTrabalhoComponent } from './pages/area-de-trabalho/area-de-trabalho.component';
import { QuadrosComponent } from './pages/quadros/quadros.component';
import { CardsComponent } from './components/cards/cards.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { CardsDetalhesComponent } from './components/cards/cards-detalhes/cards-detalhes.component';
import { QuadrosInternosComponent } from './components/quadros-internos/quadros-internos.component';
import { QuadroDetalhesComponent } from './components/quadros-internos/quadro-detalhes/quadro-detalhes.component';
import { CadastrosComponent } from './pages/cadastros/cadastros.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { FilterByStatusPipe } from './filter-by-status.pipe';
import { environment } from 'src/environments/environment';

//Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { QuadroColunaComponent } from './pages/quadros/quadro-coluna/quadro-coluna.component';
import { MatListModule } from '@angular/material/list';

import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AreaDeTrabalhoComponent,
    QuadrosComponent,
    CardsComponent,
    HeaderComponent,
    LoginComponent,
    CardsDetalhesComponent,
    QuadroDetalhesComponent,
    QuadrosInternosComponent,
    CadastrosComponent,
    QuadroColunaComponent,
    FilterByStatusPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatDialogModule,
    MatIconModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    DragDropModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    MatCheckboxModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
