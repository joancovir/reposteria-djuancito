import { TestBed } from '@angular/core/testing';

import { GarantiaService } from './garantia';

describe('Garantia', () => {
  let service: GarantiaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GarantiaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
