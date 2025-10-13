import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisConsultas } from './mis-consultas';

describe('MisConsultas', () => {
  let component: MisConsultas;
  let fixture: ComponentFixture<MisConsultas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisConsultas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisConsultas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
