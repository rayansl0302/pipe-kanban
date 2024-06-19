import { Component, Input } from '@angular/core';
import { Quadro } from 'src/app/models/quadro.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Card } from 'src/app/models/card.model';

@Component({
  selector: 'app-quadro-coluna',
  templateUrl: './quadro-coluna.component.html',
  styleUrls: ['./quadro-coluna.component.less']
})
export class QuadroColunaComponent {
  @Input() titulo!: string;
  @Input() quadro!: Quadro;

  constructor() { }

  onDrop(event: CdkDragDrop<Card[], any>): void {
    if (event.previousContainer === event.container) {
      // Se o card foi movido dentro da mesma coluna
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Se o card foi movido para outra coluna
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
      
      // Atualizar a propriedade card do quadro correspondente com a nova ordem
      this.quadro.card = event.container.data;
  
      // Salvar a nova ordem no backend ou em algum armazenamento persistente
      // this.salvarOrdemDosCards(this.quadro);
    }
  }
  
}
