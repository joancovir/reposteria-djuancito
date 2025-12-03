import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Adicional } from '../../modelos/adicional';
import { AdicionalService } from '../../servicios/adicional';
import { CarritoService} from '../../servicios/carrito';
import { AutenticacionService } from '../../servicios/autenticacion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personalizar-torta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './personalizar-torta.html',
  styleUrls: ['./personalizar-torta.css']
})
export class PersonalizarTorta implements OnInit {

  form: FormGroup;
  bizcochos: Adicional[] = [];
  rellenos: Adicional[] = [];
  toppings: Adicional[] = [];
  decorados: Adicional[] = [];

  necesitaCotizacion = false;
  precioCalculado = 0;

  constructor(
    private fb: FormBuilder,
    private adicionalService: AdicionalService,
    private carritoService: CarritoService,
    private authService: AutenticacionService,
    private router: Router,
    private location: Location
  ) {
    this.form = this.fb.group({
      saborBizcocho: [''],
      otroBizcocho: [''],
      rellenos: this.fb.array([]),
      toppings: this.fb.array([]),
      decorados: this.fb.array([]),
      otroRelleno: [''],
      otroTopping: [''],
      otroDecorado: [''],
      instrucciones: ['']
    });
  }

  ngOnInit(): void {
    this.adicionalService.getAdicionales().subscribe(data => {
      this.bizcochos = data.filter(a => a.categoria === 'bizcocho');
      this.rellenos = data.filter(a => a.categoria === 'relleno');
      this.toppings = data.filter(a => a.categoria === 'topping');
      this.decorados = data.filter(a => a.categoria === 'decorado');

      // Valor por defecto
      if (this.bizcochos.length > 0) {
        this.form.patchValue({ saborBizcocho: this.bizcochos[0].nombre });
      }
      this.calcularPrecio();
    });

    this.form.valueChanges.subscribe(() => this.calcularPrecio());
  }

  calcularPrecio() {
    let precio = 120; // precio base de torta
    this.necesitaCotizacion = false;

    const values = this.form.value;

    // BIZCOCHO
    if (values.otroBizcocho?.trim()) {
      this.necesitaCotizacion = true;
    } else if (values.saborBizcocho) {
      const biz = this.bizcochos.find(b => b.nombre === values.saborBizcocho);
      if (biz) precio += biz.costoAdicional;
    }

    // RELLENOS
    values.rellenos.forEach((nombre: string) => {
      const item = this.rellenos.find(r => r.nombre === nombre);
      if (item) precio += item.costoAdicional;
    });
    if (values.otroRelleno?.trim()) this.necesitaCotizacion = true;

    // TOPPINGS
    values.toppings.forEach((nombre: string) => {
      const item = this.toppings.find(t => t.nombre === nombre);
      if (item) precio += item.costoAdicional;
    });
    if (values.otroTopping?.trim()) this.necesitaCotizacion = true;

    // DECORADOS
    values.decorados.forEach((nombre: string) => {
      const item = this.decorados.find(d => d.nombre === nombre);
      if (item) precio += item.costoAdicional;
    });
    if (values.otroDecorado?.trim()) this.necesitaCotizacion = true;

    this.precioCalculado = this.necesitaCotizacion ? 0 : precio;
  }

  onCheckboxChange(e: any, arrayName: string) {
    const arr = this.form.get(arrayName) as FormArray;
    if (e.target.checked) {
      arr.push(new FormControl(e.target.value));
    } else {
      const i = arr.controls.findIndex(x => x.value === e.target.value);
      arr.removeAt(i);
    }
  }

 onSubmit() {
  if (!this.authService.estaLogueado()) {
    localStorage.setItem('torta_pendiente', JSON.stringify(this.form.value));
    alert('Debes iniciar sesión para continuar');
    this.router.navigate(['/iniciar-sesion'], { queryParams: { returnUrl: '/cliente/personalizar-torta' } });
    return;
  }

  const values = this.form.value;

  const tortaPersonalizada: any = {
    productoId: null,
    nombre: this.necesitaCotizacion ? 'Torta Personalizada (A cotizar)' : 'Torta Personalizada',
    precioBase: this.necesitaCotizacion ? 0 : this.precioCalculado,
    cantidad: 1,
    categoria: 'torta',
    imagenUrl: 'assets/imagenes/torta-personalizada.jpg',
    personalizable: true,
    esPersonalizada: true,
    necesitaCotizacion: this.necesitaCotizacion,
    personalizacion: {
      ...values,
    }
  };

  this.carritoService.agregarAlCarrito(tortaPersonalizada);
  this.router.navigate(['/cliente/mi-pedido']);
}

  regresar() {
    this.location.back();
  }
}