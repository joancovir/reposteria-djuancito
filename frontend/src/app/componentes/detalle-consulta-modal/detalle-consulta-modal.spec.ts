import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleConsultaModal } from './detalle-consulta-modal';

describe('DetalleConsultaModal', () => {
  let component: DetalleConsultaModal;
  let fixture: ComponentFixture<DetalleConsultaModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleConsultaModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleConsultaModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
