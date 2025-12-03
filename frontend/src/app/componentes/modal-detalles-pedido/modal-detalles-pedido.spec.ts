import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetallesPedidoComponent } from './modal-detalles-pedido';

describe('ModalDetallesPedido', () => {
  let component: ModalDetallesPedidoComponent;
  let fixture: ComponentFixture<ModalDetallesPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDetallesPedidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDetallesPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
