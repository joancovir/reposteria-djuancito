import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoGarantia } from './pago-garantia';

describe('PagoGarantia', () => {
  let component: PagoGarantia;
  let fixture: ComponentFixture<PagoGarantia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoGarantia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagoGarantia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
