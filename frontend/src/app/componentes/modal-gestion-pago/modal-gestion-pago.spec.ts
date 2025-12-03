import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGestionPago } from './modal-gestion-pago';

describe('ModalGestionPago', () => {
  let component: ModalGestionPago;
  let fixture: ComponentFixture<ModalGestionPago>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalGestionPago]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalGestionPago);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
