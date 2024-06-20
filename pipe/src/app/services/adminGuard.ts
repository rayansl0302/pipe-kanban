import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { UserProfile } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      take(1),
      switchMap(user => {
        if (user) {
          return this.firestore.doc<UserProfile>(`users/${user.uid}`).valueChanges().pipe(
            take(1),
            map(userProfile => userProfile && userProfile.accessLevel === 'admin')
          );
        } else {
          return of(false); // Retorna false se não houver usuário autenticado
        }
      }),
      tap(isAdmin => {
        if (typeof isAdmin !== 'boolean' || !isAdmin) {
          this.router.navigate(['/login']); // Navega para o login se isAdmin não for um booleano verdadeiro
        }
      }),
      map(isAdmin => !!isAdmin) // Mapeia isAdmin para um booleano
    );
  }
}
