import { TestBed } from '@angular/core/testing';

import { Promocion } from './promocion';

describe('Promocion', () => {
  let service: Promocion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Promocion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
