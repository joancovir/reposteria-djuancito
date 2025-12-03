import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionQr } from './gestion-qr';

describe('GestionQr', () => {
  let component: GestionQr;
  let fixture: ComponentFixture<GestionQr>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionQr]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionQr);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
