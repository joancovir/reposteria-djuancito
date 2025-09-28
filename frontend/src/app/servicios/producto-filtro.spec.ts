import { TestBed } from '@angular/core/testing';

import { ProductoFiltro } from './producto-filtro';

describe('ProductoFiltro', () => {
  let service: ProductoFiltro;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductoFiltro);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
