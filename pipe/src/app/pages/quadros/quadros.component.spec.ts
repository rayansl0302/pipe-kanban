import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuadrosComponent } from './quadros.component';

describe('QuadrosComponent', () => {
  let component: QuadrosComponent;
  let fixture: ComponentFixture<QuadrosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuadrosComponent]
    });
    fixture = TestBed.createComponent(QuadrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
