import { Component, OnInit } from '@angular/core';
import { AreaDeTrabalho } from 'src/app/models/area-de-trabalho.model';
import { Quadro } from 'src/app/models/quadro.model';
import { QuadrosService } from 'src/app/services/quadros.service';

@Component({
  selector: 'app-area-de-trabalho',
  templateUrl: './area-de-trabalho.component.html',
  styleUrls: ['./area-de-trabalho.component.less']
})
export class AreaDeTrabalhoComponent implements OnInit {
  areaDeTrabalho: AreaDeTrabalho = {
    id: '',
    titulo: '',
    descricao: '',
    quadros: []
  };

  constructor(private quadrosService: QuadrosService) {}

  ngOnInit(): void {
    this.carregarQuadros();
  }

  carregarQuadros(): void {
    this.quadrosService.getQuadros().subscribe(
      quadros => {
        this.areaDeTrabalho.quadros = quadros;
      },
      error => {
        console.error('Erro ao carregar quadros:', error);
      }
    );
  }
}
