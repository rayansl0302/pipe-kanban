import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Quadro } from '../models/quadro.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Card } from '../models/card.model';
import { CardsService } from './cards.service';

@Injectable({
  providedIn: 'root'
})
export class QuadrosService {
  private quadrosCollection: AngularFirestoreCollection<Quadro>;

  constructor(private firestore: AngularFirestore, private cardsService: CardsService) {
    this.quadrosCollection = this.firestore.collection<Quadro>('quadros');
  }

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
  
  atualizarQuadro(id: string, quadro: Partial<Quadro>): Promise<void> {
    return this.quadrosCollection.doc(id).update(quadro);
  }

  deletarQuadro(id: string): Promise<void> {
    return this.quadrosCollection.doc(id).delete();
  }

  adicionarCardAQuadro(quadroId: string, card: Card): Observable<void> {
    const cardId = this.firestore.createId();
    card.id = cardId;

    return new Observable(observer => {
      this.firestore.collection<Card>('cards').doc(cardId).set(card)
        .then(() => {
          return this.quadrosCollection.doc(quadroId).update({
            cardId: cardId
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

  atualizarCard(card: Card): Observable<void> {
    return from(this.firestore.collection('cards').doc(card.id).update({ status: card.status })).pipe(
      map(() => void 0),
      catchError(error => {
        console.error('Erro ao atualizar o card:', error);
        throw error;
      })
    );
  }
}
