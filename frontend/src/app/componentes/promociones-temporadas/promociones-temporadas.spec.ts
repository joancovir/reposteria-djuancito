import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromocionesTemporadas } from './promociones-temporadas';

describe('PromocionesTemporadas', () => {
  let component: PromocionesTemporadas;
  let fixture: ComponentFixture<PromocionesTemporadas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromocionesTemporadas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromocionesTemporadas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
