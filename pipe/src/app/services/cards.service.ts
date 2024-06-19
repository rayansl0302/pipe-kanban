import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Card } from '../models/card.model';
import { catchError, switchMap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { ChecklistItem } from '../models/checklist.model';
import { Comentarios } from '../models/comentarios.model';

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  private cardsCollection: AngularFirestoreCollection<Card>;
  private unsubscribe$ = new Subject<void>();

  constructor(private firestore: AngularFirestore) {
    this.cardsCollection = this.firestore.collection<Card>('cards');
  }

  // Método público para criar um novo id
  createId(): string {
    return this.firestore.createId();
  }

  // Create
  adicionarCard(card: Card): Observable<any> {
    return new Observable(observer => {
      this.cardsCollection.add(card)
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
  getAllCards(): Observable<Card[]> {
    return this.cardsCollection.valueChanges({ idField: 'id' }).pipe(
      catchError(error => {
        console.error('Error getting all cards:', error);
        throw error;
      })
    );
  }

  getCardsByQuadroId(quadroId: string): Observable<Card[]> {
    return this.firestore.collection<Card>('cards', ref => ref.where('quadroId', '==', quadroId))
      .valueChanges({ idField: 'id' })
      .pipe(
        catchError(error => {
          console.error('Error getting cards by quadroId:', error);
          throw error;
        })
      );
  }

  // Update
  atualizarCard(card: Card): Observable<void> {
    const id = card.id;
    const { id: _, ...cardToUpdate } = card;
    return new Observable<void>(observer => {
      this.cardsCollection.doc(id).update(cardToUpdate)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch(err => {
          observer.error(err);
        });
    });
  }

  // Delete
  deletarCard(id: string): Observable<void> {
    return new Observable(observer => {
      this.cardsCollection.doc(id).delete()
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch(err => {
          observer.error(err);
        });
    });
  }

  // Método para adicionar um card associado a um quadro específico
  adicionarCardComQuadro(card: Card, quadroId: string): Observable<any> {
    card.quadroId = quadroId;
    return new Observable(observer => {
      this.cardsCollection.add(card)
        .then(ref => {
          observer.next(ref);
          observer.complete();
        })
        .catch(err => {
          observer.error(err);
        });
    });
  }

  // Método para adicionar um card com checklist
  adicionarCardComChecklist(card: Card): Observable<any> {
    return new Observable(observer => {
      this.cardsCollection.add(card)
        .then(ref => {
          observer.next(ref);
          observer.complete();
        })
        .catch(err => {
          observer.error(err);
        });
    });
  }

  adicionarChecklistItem(cardId: string, item: ChecklistItem): Observable<void> {
    const cardDoc: AngularFirestoreDocument<Card> = this.cardsCollection.doc(cardId);
    return cardDoc.get().pipe(
      switchMap(snapshot => {
        const cardData = snapshot.data() as Card;
        const checklist = cardData.checklist ? [...cardData.checklist, item] : [item];
        return cardDoc.update({ checklist });
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  adicionarComentario(cardId: string, autor: string, comentario: string): Observable<void> {
    const cardDoc: AngularFirestoreDocument<Card> = this.cardsCollection.doc(cardId);
    return cardDoc.get().pipe(
      switchMap(snapshot => {
        const cardData = snapshot.data() as Card;
        const comentarios = cardData.comentarios ? [...cardData.comentarios, { id: this.firestore.createId(), autor, comentario }] : [{ id: this.firestore.createId(), autor, comentario }];
        return cardDoc.update({ comentarios });
      }),
      catchError(error => {
        throw error;
      })
    );
  }
  salvarChecklist(cardId: string, checklist: string[]): Observable<void> {
    const cardDoc: AngularFirestoreDocument<Card> = this.cardsCollection.doc(cardId);
    const checklistItems: ChecklistItem[] = checklist.map(item => ({ id: '', item, checked: false }));
    return new Observable<void>(observer => {
      cardDoc.update({ checklist: checklistItems })
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch(err => {
          observer.error(err);
        });
    });
  }
  atualizarChecklistItem(cardId: string, item: ChecklistItem): Observable<void> {
    const cardDoc: AngularFirestoreDocument<Card> = this.cardsCollection.doc(cardId);
    return cardDoc.get().pipe(
      switchMap(snapshot => {
        const cardData = snapshot.data() as Card;
        const updatedChecklist = cardData.checklist.map(checklistItem => {
          if (checklistItem.id === item.id) {
            return item;
          } else {
            return checklistItem;
          }
        });
        return cardDoc.update({ checklist: updatedChecklist });
      }),
      catchError(error => {
        throw error;
      })
    );
  }
  excluirChecklistItem(cardId: string, item: ChecklistItem): Observable<void> {
    const cardDoc: AngularFirestoreDocument<Card> = this.cardsCollection.doc(cardId);
    return cardDoc.get().pipe(
      switchMap(snapshot => {
        const cardData = snapshot.data() as Card;
        const updatedChecklist = cardData.checklist.filter(checklistItem => checklistItem.id !== item.id);
        return cardDoc.update({ checklist: updatedChecklist });
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  atualizarComentario(cardId: string, comentario: Comentarios): Observable<void> {
    const cardDoc: AngularFirestoreDocument<Card> = this.cardsCollection.doc(cardId);
    return cardDoc.get().pipe(
      switchMap(snapshot => {
        const cardData = snapshot.data() as Card;
        const comentariosAtualizados = cardData.comentarios.map(c => {
          if (c.id === comentario.id) {
            return comentario;
          } else {
            return c;
          }
        });
        return cardDoc.update({ comentarios: comentariosAtualizados });
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  excluirComentario(cardId: string, comentario: Comentarios): Observable<void> {
    const cardDoc: AngularFirestoreDocument<Card> = this.cardsCollection.doc(cardId);
    return cardDoc.get().pipe(
      switchMap(snapshot => {
        const cardData = snapshot.data() as Card;
        const comentariosAtualizados = cardData.comentarios.filter(c => c.id !== comentario.id);
        return cardDoc.update({ comentarios: comentariosAtualizados });
      }),
      catchError(error => {
        throw error;
      })
    );
  }
  getComentariosAtualizados(cardId: string): Observable<Comentarios[]> {
    const cardDoc: AngularFirestoreDocument<Card> = this.cardsCollection.doc(cardId);
    return cardDoc.valueChanges().pipe(
      switchMap(card => {
        if (card && card.comentarios) {
          return this.firestore.collection<Comentarios>('comentarios', ref => ref.where('cardId', '==', cardId))
            .valueChanges({ idField: 'id' });
        } else {
          return [];
        }
      }),
      catchError(error => {
        console.error('Error getting updated comments:', error);
        throw error;
      })
    );
  }

  // Métodos anteriores...

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  
}

