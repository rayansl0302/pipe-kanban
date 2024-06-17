import { TestBed } from '@angular/core/testing';

import { AreaDeTrabalhoService } from './area-de-trabalho.service';

describe('AreaDeTrabalhoService', () => {
  let service: AreaDeTrabalhoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AreaDeTrabalhoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
