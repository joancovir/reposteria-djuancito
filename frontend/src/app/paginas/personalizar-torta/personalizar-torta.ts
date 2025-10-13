import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Adicional } from '../../modelos/adicional';
import { AdicionalService } from '../../servicios/adicional';
import { CarritoService } from '../../servicios/carrito';
import { Producto } from '../../modelos/producto'; // Importa el modelo de producto

@Component({
  selector: 'app-personalizar-torta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './personalizar-torta.html',
  styleUrl: './personalizar-torta.css'
})
export class PersonalizarTorta implements OnInit {

  personalizacionForm: FormGroup;
  bizcochos :Adicional[] = [];
  rellenos: Adicional[] = [];
  toppings: Adicional[] = [];
  decorados: Adicional[] = [];

  constructor(
    private fb: FormBuilder,
    private adicionalService: AdicionalService,
    private carritoService: CarritoService
  ) {
    this.personalizacionForm = this.fb.group({
      saborBizcocho: [''],
      rellenos: this.fb.array([]),
      toppings: this.fb.array([]),
      decorados: this.fb.array([]),
      instrucciones: ['']
    });
  }

  ngOnInit(): void {
    this.adicionalService.getAdicionales().subscribe(data => {
      this.bizcochos = data.filter(a => a.categoria === 'bizcocho'); 
      this.rellenos = data.filter(a => a.categoria === 'relleno');
      this.toppings = data.filter(a => a.categoria === 'topping');

      if (this.bizcochos.length > 0) {
        this.personalizacionForm.patchValue({ saborBizcocho: this.bizcochos[0].nombre });
      }
    });
  }

  // Lógica para manejar los checkboxes
  onCheckboxChange(event: any, controlName: string) {
    const formArray: FormArray = this.personalizacionForm.get(controlName) as FormArray;
    if (event.target.checked) {
      formArray.push(new FormControl(event.target.value));
    } else {
      let i: number = 0;
      formArray.controls.forEach((ctrl: any) => {
        if (ctrl.value == event.target.value) {
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  onSubmit(): void {
    if (this.personalizacionForm.valid) {
      // Creamos un objeto "Producto" especial para el carrito
      const tortaPersonalizada: Producto = {
        productoId: 999, // Un ID temporal
        nombre: 'Torta Personalizada',
        categoria: 'torta',
        descripcion: 'Diseño único hecho a tu medida',
        precioBase: 120, // Un precio base para la torta personalizada
        imagenUrl: 'assets/imagenes/torta-personalizada.jpg',
        personalizable: true,
        // Guardamos las selecciones del cliente
        personalizacion: this.personalizacionForm.value 
      };
      this.carritoService.agregarAlCarrito(tortaPersonalizada);
    }
  }
}