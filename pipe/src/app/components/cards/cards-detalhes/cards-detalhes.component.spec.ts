import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsDetalhesComponent } from './cards-detalhes.component';

describe('CardsDetalhesComponent', () => {
  let component: CardsDetalhesComponent;
  let fixture: ComponentFixture<CardsDetalhesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardsDetalhesComponent]
    });
    fixture = TestBed.createComponent(CardsDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
