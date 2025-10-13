import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAdicionalesComponent } from './modal-adicionales';

describe('ModalAdicionales', () => {
  let component: ModalAdicionalesComponent;
  let fixture: ComponentFixture<ModalAdicionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAdicionalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAdicionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
