import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { UserProfile } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore, private router: Router) { }

  login(email: string, password: string): Promise<void> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {
          this.getUserProfile(user.uid).subscribe((profile: UserProfile | undefined) => {
            if (profile) {
              console.log('UID do usuário:', user.uid);
              console.log('Nível de acesso:', profile.accessLevel);
              
              if (profile.accessLevel) {
                localStorage.setItem('accessLevel', profile.accessLevel);
              } else {
                console.warn('Nível de acesso não definido.');
                localStorage.removeItem('accessLevel'); // Remover a chave se o nível de acesso não estiver definido
              }
          
              localStorage.setItem('uid', user.uid);
              this.router.navigate(['/home']);
            } else {
              console.log('Perfil de usuário não encontrado.');
            }
          });          
        } else {
          console.log('Usuário não encontrado.');
        }
      })
      .catch(error => {
        throw error;
      });
  }

  logout(): Promise<void> {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('accessLevel');
      localStorage.removeItem('uid');
      this.router.navigate(['/login']);
    });
  }

  isLoggedIn(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map(user => !!user)
    );
  }

  registerUser(email: string, password: string, accessLevel: string, workspace: string): Promise<void> {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user;
        if (user) {
          const userData = {
            email: email,
            accessLevel: accessLevel,
            workspace: workspace,
            uid: user.uid
          };
          return this.firestore.collection('users').doc(user.uid).set(userData);
        } else {
          throw new Error('Erro ao criar UID do usuário.');
        }
      })
      .catch(error => {
        throw error;
      });
  }

  getUserProfile(uid: string): Observable<UserProfile | undefined> {
    return this.firestore.doc<UserProfile>(`users/${uid}`).valueChanges();
  }
}
