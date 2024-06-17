import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuadrosInternosComponent } from './quadros-internos.component';
describe('QuadrosComponent', () => {
  let component: QuadrosInternosComponent;
  let fixture: ComponentFixture<QuadrosInternosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuadrosInternosComponent]
    });
    fixture = TestBed.createComponent(QuadrosInternosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
