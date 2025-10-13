import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarruselPrincipalComponent } from './carrusel-principal';

describe('CarruselPrincipal', () => {
  let component: CarruselPrincipalComponent;
  let fixture: ComponentFixture<CarruselPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarruselPrincipalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarruselPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
