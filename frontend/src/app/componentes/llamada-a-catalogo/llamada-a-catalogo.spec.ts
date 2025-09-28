import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlamadaACatalogo } from './llamada-a-catalogo';

describe('LlamadaACatalogo', () => {
  let component: LlamadaACatalogo;
  let fixture: ComponentFixture<LlamadaACatalogo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LlamadaACatalogo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LlamadaACatalogo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
