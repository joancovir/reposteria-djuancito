import { TestBed } from '@angular/core/testing';

import { Adicional } from './adicional';

describe('Adicional', () => {
  let service: Adicional;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Adicional);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
