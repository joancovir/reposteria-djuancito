import { TestBed } from '@angular/core/testing';

import { Temporada } from './temporada';

describe('Temporada', () => {
  let service: Temporada;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Temporada);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
