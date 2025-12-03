import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAdicionales } from './gestion-adicionales';

describe('GestionAdicionales', () => {
  let component: GestionAdicionales;
  let fixture: ComponentFixture<GestionAdicionales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionAdicionales]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionAdicionales);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
