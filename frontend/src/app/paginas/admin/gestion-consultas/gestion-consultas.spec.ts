import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionConsultas } from './gestion-consultas';

describe('GestionConsultas', () => {
  let component: GestionConsultas;
  let fixture: ComponentFixture<GestionConsultas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionConsultas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionConsultas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
