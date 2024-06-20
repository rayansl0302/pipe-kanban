import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AreaDeTrabalho } from 'src/app/models/area-de-trabalho.model';
import { UserProfile } from 'src/app/models/user-profile.model';
import { AreaDeTrabalhoService } from 'src/app/services/area-de-trabalho.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  areasDeTrabalho: AreaDeTrabalho[] = [];
  isAdmin: boolean = false;

  constructor(private areaDeTrabalhoService: AreaDeTrabalhoService, private authService: AuthService, private afAuth: AngularFireAuth) {}

  ngOnInit(): void {
    this.carregarAreasDeTrabalho();
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.authService.getUserProfile(user.uid).subscribe((profile: UserProfile | undefined) => { 
          if (profile) {
            this.isAdmin = profile.accessLevel === 'admin';
          } else {
            this.isAdmin = false; // Defina isAdmin como false caso o perfil seja undefined
          }
        });
      }
    });
    
  }
  logout(): void {
    this.authService.logout();
  }
  carregarAreasDeTrabalho(): void {
    this.areaDeTrabalhoService.getAreasDeTrabalho('').subscribe(
      areas => {
        this.areasDeTrabalho = areas;
      },
      error => {
        console.error('Erro ao carregar áreas de trabalho:', error);
      }
    );
  }
}
