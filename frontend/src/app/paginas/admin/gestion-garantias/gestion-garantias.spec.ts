import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionGarantias } from './gestion-garantias';

describe('GestionGarantias', () => {
  let component: GestionGarantias;
  let fixture: ComponentFixture<GestionGarantias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionGarantias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionGarantias);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
