import { Component, OnInit } from '@angular/core';
import { AreaDeTrabalho } from 'src/app/models/area-de-trabalho.model';
import { AreaDeTrabalhoService } from 'src/app/services/area-de-trabalho.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  areasDeTrabalho: AreaDeTrabalho[] = [];

  constructor(private areaDeTrabalhoService: AreaDeTrabalhoService) {}

  ngOnInit(): void {
    this.carregarAreasDeTrabalho();
  }

  carregarAreasDeTrabalho(): void {
    this.areaDeTrabalhoService.getAreasDeTrabalho().subscribe(
      areas => {
        this.areasDeTrabalho = areas;
      },
      error => {
        console.error('Erro ao carregar áreas de trabalho:', error);
      }
    );
  }
}
