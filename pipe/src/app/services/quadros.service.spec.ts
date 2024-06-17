import { TestBed } from '@angular/core/testing';

import { QuadrosService } from './quadros.service';

describe('QuadrosService', () => {
  let service: QuadrosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuadrosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
