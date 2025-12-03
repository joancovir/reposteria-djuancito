import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosRealizados } from './productos-realizados';

describe('ProductosRealizados', () => {
  let component: ProductosRealizados;
  let fixture: ComponentFixture<ProductosRealizados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosRealizados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosRealizados);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
