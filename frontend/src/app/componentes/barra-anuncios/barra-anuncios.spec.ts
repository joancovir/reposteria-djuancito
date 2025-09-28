import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarraAnuncios } from './barra-anuncios';

describe('BarraAnuncios', () => {
  let component: BarraAnuncios;
  let fixture: ComponentFixture<BarraAnuncios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarraAnuncios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarraAnuncios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
