import { Injectable } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Quadro } from '../models/quadro.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Card } from '../models/card.model';
import firebase from 'firebase/compat/app';  // Import Firebase compat package
import { CardsService } from './cards.service'; // Import CardsService

@Injectable({
  providedIn: 'root'
})
export class QuadrosService {
  private quadrosCollection: AngularFirestoreCollection<Quadro>;

  constructor(private firestore: AngularFirestore, private cardsService: CardsService) {
    this.quadrosCollection = this.firestore.collection<Quadro>('quadros');
  }

  // Create
  adicionarQuadro(quadro: Quadro): Observable<any> {
    return new Observable(observer => {
      this.quadrosCollection.add(quadro)
        .then(ref => {
          observer.next(ref);
          observer.complete();
        })
        .catch(err => {
          observer.error(err);
        });
    });
  }

  // Read
  getQuadros(): Observable<Quadro[]> {
    return this.quadrosCollection.valueChanges({ idField: 'id' }).pipe(
      catchError(error => {
        console.error('Error getting quadros:', error);
        throw error;
      })
    );
  }

  getQuadro(id: string): Observable<Quadro | undefined> {
    return this.quadrosCollection.doc(id).snapshotChanges().pipe(
      map(action => {
        if (!action.payload.exists) {
          return undefined;
        } else {
          const data = action.payload.data() as Quadro;
          console.log('Dados do quadro:', data);
          return { ...data, id };
        }
      }),
      catchError(error => {
        console.error('Error getting quadro:', error);
        throw error;
      })
    );
  }
  
  // Update
  atualizarQuadro(id: string, quadro: Partial<Quadro>): Promise<void> {
    return this.quadrosCollection.doc(id).update(quadro);
  }

  // Delete
  deletarQuadro(id: string): Promise<void> {
    return this.quadrosCollection.doc(id).delete();
  }


  // Adicionar cartão ao quadro
  adicionarCardAQuadro(quadroId: string, card: Card): Observable<void> {
    // Gerar um ID para o cartão
    const cardId = this.firestore.createId();
    card.id = cardId;

    return new Observable(observer => {
      // Adicionar o cartão à coleção 'cards'
      this.firestore.collection<Card>('cards').doc(cardId).set(card)
        .then(() => {
          // Atualizar o quadro com o ID do cartão
          return this.quadrosCollection.doc(quadroId).update({
            cardId: cardId // Usar apenas o ID do cartão
          });
        })
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch(err => {
          observer.error(err);
        });
    });
  }
  // Recuperar todos os cartões associados a um quadro
  getCardsDoQuadro(quadroId: string): Observable<Card[]> {
    return this.cardsService.getCardsByQuadroId(quadroId);
  }

  salvarStatusDosCards(cards: Card[]): Observable<void> {
    const batch = this.firestore.firestore.batch();

    cards.forEach(card => {
      const cardRef = this.firestore.collection('cards').doc(card.id).ref;
      batch.update(cardRef, { status: card.status });
    });

    return new Observable<void>(observer => {
      batch.commit().then(() => {
        observer.next();
        observer.complete();
      }).catch(error => {
        console.error('Erro ao salvar o status dos cards:', error);
        observer.error(error);
      });
    });
  }
}
