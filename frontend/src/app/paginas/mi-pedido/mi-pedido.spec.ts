import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiPedido } from './mi-pedido';

describe('MiPedido', () => {
  let component: MiPedido;
  let fixture: ComponentFixture<MiPedido>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiPedido]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiPedido);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
