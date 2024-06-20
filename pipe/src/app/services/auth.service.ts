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

  // Método para realizar login
  login(email: string, password: string): Promise<void> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {
          // Obtém o perfil do usuário para obter o nível de acesso
          this.getUserProfile(user.uid).subscribe((profile: UserProfile | undefined) => {
            if (profile) {
              console.log('UID do usuário:', user.uid);
              console.log('Nível de acesso:', profile.accessLevel);
            } else {
              console.log('Perfil de usuário não encontrado.');
            }
          });
        } else {
          console.log('Usuário não encontrado.');
        }
        this.router.navigate(['/home']);
      })
      .catch(error => {
        throw error;
      });
  }
  


  isLoggedIn(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map(user => !!user)
    );
  }

  logout(): Promise<void> {
    return this.afAuth.signOut().then(() => {
      // Limpa os dados do localStorage ao fazer logout
      localStorage.removeItem('accessLevel');
      localStorage.removeItem('uid');
      this.router.navigate(['/login']);
    });
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
            uid: user.uid // Usar o mesmo UID gerado pelo Firebase Authentication
          };
          // Criar um documento na coleção 'users' do Firestore com o mesmo UID
          return this.firestore.collection('users').doc(user.uid).set(userData);
        } else {
          throw new Error('Erro ao criar UID do usuário.');
        }
      })
      .catch(error => {
        throw error;
      });
  }
  

  // Captura o accessLevel e o salva no localStorage
  private captureAccessLevel(uid: string | undefined): void {
    if (uid) {
      this.firestore.doc<UserProfile>(`users/${uid}`).valueChanges().subscribe(userProfile => {
        if (userProfile && userProfile.accessLevel) {
          localStorage.setItem('accessLevel', userProfile.accessLevel);
          localStorage.setItem('uid', uid);
        }
      });
    }
  }

  getUserProfile(uid: string): Observable<UserProfile | undefined> {
    return this.firestore.doc<UserProfile>(`users/${uid}`).valueChanges();
  }
}
