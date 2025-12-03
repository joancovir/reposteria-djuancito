import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPagos } from './gestion-pagos';

describe('GestionPagos', () => {
  let component: GestionPagos;
  let fixture: ComponentFixture<GestionPagos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionPagos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionPagos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
