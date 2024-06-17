import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaDeTrabalhoComponent } from './area-de-trabalho.component';

describe('AreaDeTrabalhoComponent', () => {
  let component: AreaDeTrabalhoComponent;
  let fixture: ComponentFixture<AreaDeTrabalhoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AreaDeTrabalhoComponent]
    });
    fixture = TestBed.createComponent(AreaDeTrabalhoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
