import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Card } from 'src/app/models/card.model';
import { ChecklistItem } from 'src/app/models/checklist.model';
import { Comentarios } from 'src/app/models/comentarios.model';
import { CardsService } from 'src/app/services/cards.service';

@Component({
  selector: 'app-cards-detalhes',
  templateUrl: './cards-detalhes.component.html',
  styleUrls: ['./cards-detalhes.component.less']
})
export class CardsDetalhesComponent implements OnInit, OnDestroy {
  checklistForm!: FormGroup;
  card!: Card;
  private unsubscribe$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<CardsDetalhesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { card: Card },
    private cardService: CardsService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    console.log('Card carregado:', this.data.card);
    this.card = this.data.card;
    this.checklistForm = this.createChecklistControls();
  
    this.cardService.getComentariosAtualizados(this.card.id).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(comentarios => {
      if (comentarios && comentarios.length > 0) {
        this.card.comentarios = comentarios;
      }
    });
  }
  
  createChecklistControls() {
    const controls: { [key: string]: FormGroup } = {};

    if (this.card.checklist && this.card.checklist.length > 0) {
      this.card.checklist.forEach((item: ChecklistItem, index: number) => {
        controls[`checklistItem${index}`] = this.fb.group({
          checked: [item.checked]
        });
      });
    }
    return this.fb.group(controls);
  }

  fechar(): void {
    this.dialogRef.close();
  }

  adicionarComentario(): void {
    const autor = prompt('Digite o seu nome:');
    const comentario = prompt('Digite o seu comentário:');
    if (autor && comentario) {
      this.cardService.adicionarComentario(this.card.id, autor, comentario)
        .subscribe(
          () => {
            this.cardService.getCardsByQuadroId(this.card.quadroId).subscribe(cards => {
              this.card = cards.find(c => c.id === this.card.id)!;
            });
          },
          error => console.error('Erro ao adicionar comentário:', error)
        );
    }
  }

  editarComentario(comentario: Comentarios): void {
    const novoComentario = prompt('Edite o comentário:', comentario.comentario);
    if (novoComentario) {
      comentario.comentario = novoComentario;
      this.cardService.atualizarComentario(this.card.id, comentario)
        .subscribe(
          () => {
            console.log('Comentário atualizado com sucesso.');
          },
          error => console.error('Erro ao atualizar comentário:', error)
        );
    }
  }

  excluirComentario(comentario: Comentarios): void {
    const confirmacao = confirm('Tem certeza que deseja excluir este comentário?');
    if (confirmacao) {
      this.cardService.excluirComentario(this.card.id, comentario)
        .subscribe(
          () => {
            console.log('Comentário excluído com sucesso.');
          },
          error => console.error('Erro ao excluir comentário:', error)
        );
    }
  }

  adicionarChecklist(): void {
    const novoItemDescricao = prompt('Digite o novo item para o checklist:');
    if (novoItemDescricao) {
      const newChecklistItem: ChecklistItem = { id: this.cardService.createId(), item: novoItemDescricao, checked: false };
      this.cardService.adicionarChecklistItem(this.card.id, newChecklistItem)
        .subscribe(
          () => {
            this.atualizarCard();
          },
          error => console.error('Erro ao adicionar item ao checklist:', error)
        );
    }
  }

  editarItem(index: number): void {
    const novoTexto = prompt('Digite o novo texto para o item do checklist:');
    if (novoTexto) {
      const checklistItem = this.card.checklist[index];
      checklistItem.item = novoTexto;
      this.cardService.atualizarChecklistItem(this.card.id, checklistItem)
        .subscribe(
          () => {
            this.atualizarCard();
          },
          error => console.error('Erro ao atualizar item do checklist:', error)
        );
    }
  }

  excluirItem(index: number): void {
    if (confirm('Tem certeza de que deseja excluir este item do checklist?')) {
      const checklistItem = this.card.checklist[index];
      this.cardService.excluirChecklistItem(this.card.id, checklistItem)
        .subscribe(
          () => {
            this.atualizarCard();
          },
          error => console.error('Erro ao excluir item do checklist:', error)
        );
    }
  }

  toggleCheckbox(itemIndex: number): void {
    // Marque/desmarque o checkbox e salve o checklist
    this.checklistForm.controls[`checked${itemIndex}`].setValue(!this.checklistForm.controls[`checked${itemIndex}`].value);
    this.salvarChecklist();
  }

  public salvarChecklist(): void {
    const checklistValues = this.checklistForm.value;

    // Iterar sobre os valores do formulário
    for (const key in checklistValues) {
      if (checklistValues.hasOwnProperty(key)) {
        const itemIndex = parseInt(key.replace('checklistItem', ''), 10);
        const checked = checklistValues[key].checked;

        console.log(`Item ${itemIndex} marcado: ${checked}`);

        // Atualizar o estado do item no checklist apenas se estiver marcado
        if (checked) {
          const checklistItem: ChecklistItem = {
            id: this.card.checklist[itemIndex].id,
            item: this.card.checklist[itemIndex].item,
            checked: checked
          };

          // Chame o método do serviço para atualizar o checklist item
          this.cardService.atualizarChecklistItem(this.card.id, checklistItem)
            .subscribe(
              () => console.log('Checklist item atualizado com sucesso.'),
              error => console.error('Erro ao atualizar checklist item:', error)
            );
        }
      }
    }
  }
  excluirCard(): void {
    const confirmacao = confirm('Tem certeza que deseja excluir este card?');
    if (confirmacao) {
      this.cardService.excluirCard(this.card.id)
        .subscribe(
          () => {
            console.log('Card excluído com sucesso.');
            this.dialogRef.close();
          },
          error => console.error('Erro ao excluir card:', error)
        );
    }
  }

  private atualizarCard(): void {
    this.cardService.getCardsByQuadroId(this.card.quadroId).subscribe(cards => {
      this.card = cards.find(c => c.id === this.card.id)!;
      this.checklistForm = this.createChecklistControls();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
