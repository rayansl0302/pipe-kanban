import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AreaDeTrabalho } from 'src/app/models/area-de-trabalho.model';
import { Quadro } from 'src/app/models/quadro.model';
import { Card } from 'src/app/models/card.model';
import { AreaDeTrabalhoService } from 'src/app/services/area-de-trabalho.service';
import { QuadrosService } from 'src/app/services/quadros.service';
import { CardsService } from 'src/app/services/cards.service';
import { ChecklistService } from 'src/app/services/checklist.service';
import { ChecklistItem } from 'src/app/models/checklist.model';

@Component({
  selector: 'app-cadastros',
  templateUrl: './cadastros.component.html',
  styleUrls: ['./cadastros.component.less']
})
export class CadastrosComponent implements OnInit {
  areaDeTrabalhoForm!: FormGroup;
  quadroForm!: FormGroup;
  cardForm!: FormGroup;
  areasDeTrabalhoOptions: AreaDeTrabalho[] = [];
  quadrosOptions: Quadro[] = [];
  statusOptions: string[] = ['A fazer', 'Em andamento', 'Em revisão', 'Concluído'];
  checklists: ChecklistItem[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private areaDeTrabalhoService: AreaDeTrabalhoService,
    private quadroService: QuadrosService,
    private cardService: CardsService,
    private checklistService: ChecklistService
  ) { }

  ngOnInit(): void {
    this.areaDeTrabalhoForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required]
    });

    this.quadroForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      areaDeTrabalhoId: ['', Validators.required]
    });

    this.cardForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      autor: ['', Validators.required],
      descricao: ['', Validators.required],
      atribuido: ['', Validators.required],
      imgUrl: ['', Validators.required],
      dataCriacao: ['', Validators.required],
      quadroId: ['', Validators.required],
      status: ['', Validators.required],
      checklistEnabled: [false, Validators.required], // Adicionado o campo checklistEnabled
      checklists: this.formBuilder.array([]) // Adicionado o campo checklists como um FormArray
    });

    this.carregarAreasDeTrabalho();
    this.carregarQuadros();
  }

  addChecklistItem() {
    const checklistsArray = this.cardForm.get('checklists') as FormArray;
    const newChecklistItem = this.formBuilder.control('');
    checklistsArray.push(newChecklistItem);
  }

  salvarChecklist() {
    if (this.cardForm.valid) {
      const checklistItems = this.cardForm.get('checklists')?.value;
      if (Array.isArray(checklistItems)) {
        // Adicionar cada item do checklist ao serviço de checklist
        checklistItems.forEach((item: ChecklistItem) => {
          this.checklistService.adicionarItem(item);
        });
        console.log('Itens de checklist salvos com sucesso.');
      } else {
        console.error('O valor de checklistItems não é um array.');
      }
    } else {
      console.error('O formulário de checklist não é válido.');
    }
  }

  removeChecklistItem(index: number) {
    const checklistsArray = this.cardForm.get('checklists') as FormArray;
    checklistsArray.removeAt(index);
  }

  carregarAreasDeTrabalho() {
    this.areaDeTrabalhoService.getAreasDeTrabalho().subscribe(
      (areas: AreaDeTrabalho[]) => {
        this.areasDeTrabalhoOptions = areas;
      },
      (error: any) => {
        console.error('Erro ao carregar áreas de trabalho:', error);
      }
    );
  }

  carregarQuadros() {
    this.quadroService.getQuadros().subscribe(
      (quadros: Quadro[]) => {
        this.quadrosOptions = quadros;
      },
      (error: any) => {
        console.error('Erro ao carregar quadros:', error);
      }
    );
  }

  salvarAreaDeTrabalho() {
    const areaDeTrabalho: AreaDeTrabalho = this.areaDeTrabalhoForm.value;
    this.areaDeTrabalhoService.adicionarAreaDeTrabalho(areaDeTrabalho).subscribe(
      (ref: any) => {
        console.log('Área de trabalho salva com sucesso:', ref.id);
        this.carregarAreasDeTrabalho();
      },
      (error: any) => {
        console.error('Erro ao salvar área de trabalho:', error);
      }
    );
  }

  salvarQuadro() {
    const quadro: Quadro = this.quadroForm.value;
    this.quadroService.adicionarQuadro(quadro).subscribe(
      (ref: any) => {
        console.log('Quadro salvo com sucesso:', ref.id);
        this.carregarQuadros();
      },
      (error: any) => {
        console.error('Erro ao salvar quadro:', error);
      }
    );
  }

  salvarCard() {
    if (this.cardForm.valid) {
      const cardData = this.cardForm.value;
      const card: Card = {
        id: '', // Defina o id conforme necessário
        autor: cardData.autor,
        atribuido: cardData.atribuido,
        titulo: cardData.titulo,
        descricao: cardData.descricao,
        dataCriacao: cardData.dataCriacao,
        status: cardData.status,
        imgUrl: cardData.imgUrl,
        comentarios: [], // Adicione comentários conforme necessário
        checklist: [], // Incluir o campo checklist como um array vazio
        quadroId: cardData.quadroId // Adicione a propriedade quadroId
      };
      
  
      // Verificar se o campo checklist está definido no formulário
      if (cardData.checklist) {
        card.checklist = cardData.checklist; // Adicionar o checklist do formulário
      }
  
      this.cardService.adicionarCard(card).subscribe(
        (response: any) => {
          console.log('Card salvo com sucesso:', response);
        },
        (error: any) => {
          console.error('Erro ao salvar card:', error);
        }
      );
    } else {
      console.error('O formulário de card não é válido.');
    }
  }
  
  

}
   