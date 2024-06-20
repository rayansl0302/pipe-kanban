import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AreaDeTrabalho } from '../models/area-de-trabalho.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AreaDeTrabalhoService {
  private areasDeTrabalhoCollection: AngularFirestoreCollection<AreaDeTrabalho>;

  constructor(private firestore: AngularFirestore) {
    this.areasDeTrabalhoCollection = this.firestore.collection<AreaDeTrabalho>('areasDeTrabalho');
  }
  

  // Create
  adicionarAreaDeTrabalho(areaDeTrabalho: AreaDeTrabalho): Observable<any> {
    return new Observable(observer => {
      this.areasDeTrabalhoCollection.add(areaDeTrabalho)
        .then(ref => {
          observer.next(ref);
          observer.complete();
        })
        .catch(err => {
          observer.error(err);
        });
    });
  }

   // Carregar áreas de trabalho associadas ao usuário logado
   getAreasDeTrabalho(userId: string): Observable<AreaDeTrabalho[]> {
    return this.firestore.collection<AreaDeTrabalho>('areasDeTrabalho', ref =>
      ref.where('userId', '==', userId) // Filtrar áreas de trabalho pelo ID do usuário
    ).valueChanges({ idField: 'id' }).pipe(
      catchError(error => {
        console.error('Erro ao obter áreas de trabalho:', error);
        throw error;  
      })
    );
  }
  // Update
  atualizarAreaDeTrabalho(id: string, areaDeTrabalho: AreaDeTrabalho): Promise<void> {
    return this.areasDeTrabalhoCollection.doc(id).update(areaDeTrabalho);
  }

  // Delete
  deletarAreaDeTrabalho(id: string): Promise<void> {
    return this.areasDeTrabalhoCollection.doc(id).delete();
  }
}
