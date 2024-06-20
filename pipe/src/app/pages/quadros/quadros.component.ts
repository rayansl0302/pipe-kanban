import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Quadro } from 'src/app/models/quadro.model';
import { Card } from 'src/app/models/card.model';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { QuadrosService } from 'src/app/services/quadros.service';
import { CardsDetalhesComponent } from 'src/app/components/cards/cards-detalhes/cards-detalhes.component';
import { from } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-quadros',
  templateUrl: './quadros.component.html',
  styleUrls: ['./quadros.component.less']
})
export class QuadrosComponent implements OnInit {
  quadro: Quadro | undefined;
  cards: Card[] = [];
  colunas = [
    { id: 'a-fazer', nome: 'A fazer', status: 'A fazer' },
    { id: 'em-andamento', nome: 'Em andamento', status: 'Em andamento' },
    { id: 'revisado', nome: 'Revisado', status: 'Revisado' },
    { id: 'feito', nome: 'Feito', status: 'Feito' }
  ];

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private quadrosService: QuadrosService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.quadrosService.getQuadro(id).subscribe(
        quadro => {
          if (quadro) {
            this.quadro = quadro;
            this.carregarCardsDoQuadro(quadro.id);
          } else {
            console.error('Quadro não encontrado.');
          }
        },
        error => {
          console.error('Erro ao carregar o quadro:', error);
        }
      );
    }
  }

  getColunaIds(): string[] {
    return this.colunas.map(coluna => coluna.id);
  }

  carregarCardsDoQuadro(quadroId: string): void {
    this.quadrosService.getCardsDoQuadro(quadroId).subscribe(
      cards => {
        this.cards = cards;
        console.log('Cards do Quadro:', this.cards);
      },
      error => {
        console.error('Erro ao carregar os cards do quadro:', error);
      }
    );
  }

  openDialog(card: Card): void {
    const dialogRef = this.dialog.open(CardsDetalhesComponent, {
      width: '1200px',
      data: { card: card }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adicionarCard(result);
      }
    });
  }
  
  onDrop(event: CdkDragDrop<Card[]>, columnId: string): void {
    console.log('Evento:', event);
    console.log('ID da Coluna:', columnId);
  
    if (event.previousContainer === event.container) {
      console.log('Movendo dentro da mesma coluna');
      if (event.container.data && event.container.data.length > 0) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        console.log('Ordem dos cards atualizada');
        this.salvarOrdemDosCards();
      }
    } else {
      console.log('Movendo para outra coluna');
      if (event.previousContainer.data && event.container.data) {
        const card = event.previousContainer.data[event.previousIndex];
        console.log(`Card ${card.id} movido para a coluna ${columnId}`);
  
        // Atualizar o status do card com o ID da coluna
        card.status = columnId;
  
        // Transferir o card para a nova coluna
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
  
        // Salvar a ordem dos cards e o novo status do card
        this.quadrosService.atualizarCard(card).subscribe(() => {
          console.log(`Status do card ${card.id} atualizado com sucesso`);
        }, error => {
          console.error('Erro ao atualizar o status do card:', error);
        });
      }
    }
  }
  
  salvarOrdemDosCards(): void {
    if (this.quadro) {
      console.log('Salvando a nova ordem dos cards:', this.cards);
  
      this.quadrosService.atualizarQuadro(this.quadro.id, { card: this.cards }).then(() => {
        console.log('Ordem dos cards atualizada com sucesso');
  
        from(this.quadrosService.salvarStatusDosCards(this.cards)).pipe(
          catchError(error => {
            console.error('Erro ao salvar a ordem dos cards:', error);
            return [];
          })
        ).subscribe(() => {
          console.log('Status dos cards salvos com sucesso');
        });
      }).catch(error => {
        console.error('Erro ao atualizar a ordem dos cards:', error);
      });
    }
  }
  
  getCardsByStatus(status: string): Card[] {
    return this.cards.filter(card => card.status === status);
  }

  adicionarCard(card: Card): void {
    if (this.quadro) {
      this.quadrosService.adicionarCardAQuadro(this.quadro.id, card).subscribe(
        () => {
          console.log('Card adicionado e quadro atualizado com sucesso');
          this.cards.push(card);
        },
        error => {
          console.error('Erro ao adicionar card:', error);
        }
      );
    }
  }
}
