import { Component, Input } from '@angular/core';
import { Card } from 'src/app/models/card.model';
import { MatDialog } from '@angular/material/dialog';
import { CardsDetalhesComponent } from './cards-detalhes/cards-detalhes.component';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.less']
})
export class CardsComponent {
  @Input() cards: Card[] = [];

  constructor(public dialog: MatDialog) {}

  openDetalhes(card: Card): void {
    this.dialog.open(CardsDetalhesComponent, {
      width: '400px',
      data: card
    });
  }
}
