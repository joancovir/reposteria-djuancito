import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalizarTorta } from './personalizar-torta';

describe('PersonalizarTorta', () => {
  let component: PersonalizarTorta;
  let fixture: ComponentFixture<PersonalizarTorta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalizarTorta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalizarTorta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
