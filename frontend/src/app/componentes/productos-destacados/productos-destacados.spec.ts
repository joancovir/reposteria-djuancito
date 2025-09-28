import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosDestacados } from './productos-destacados';

describe('ProductosDestacados', () => {
  let component: ProductosDestacados;
  let fixture: ComponentFixture<ProductosDestacados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosDestacados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosDestacados);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
