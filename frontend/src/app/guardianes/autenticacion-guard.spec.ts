import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

// RUTA Y NOMBRE CORREGIDOS
import { authGuard } from './autenticacion-guard';

describe('autenticacionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});