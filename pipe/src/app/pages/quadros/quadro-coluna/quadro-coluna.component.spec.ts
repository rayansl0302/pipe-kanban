import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuadroColunaComponent } from './quadro-coluna.component';

describe('QuadroColunaComponent', () => {
  let component: QuadroColunaComponent;
  let fixture: ComponentFixture<QuadroColunaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuadroColunaComponent]
    });
    fixture = TestBed.createComponent(QuadroColunaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
