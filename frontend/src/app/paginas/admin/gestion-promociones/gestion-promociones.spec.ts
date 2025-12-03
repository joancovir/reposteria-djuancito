import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPromociones } from './gestion-promociones';

describe('GestionPromociones', () => {
  let component: GestionPromociones;
  let fixture: ComponentFixture<GestionPromociones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionPromociones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionPromociones);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
