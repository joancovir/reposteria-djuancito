// src/app/paginas/cliente/personalizar-torta/personalizar-torta.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Adicional } from '../../modelos/adicional';
import { AdicionalService } from '../../servicios/adicional';
import { CarritoService } from '../../servicios/carrito';
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

      // Valor por defecto si existe
      if (this.bizcochos.length > 0) {
        this.form.patchValue({ saborBizcocho: this.bizcochos[0].nombre });
      }

      this.calcularPrecio();
    });

    this.form.valueChanges.subscribe(() => this.calcularPrecio());
  }

  calcularPrecio() {
    let precio = 120; // Precio base
    this.necesitaCotizacion = false;
    const values = this.form.value;

    // Bizcocho personalizado
    if (values.otroBizcocho?.trim()) {
      this.necesitaCotizacion = true;
    } else if (values.saborBizcocho) {
      const biz = this.bizcochos.find(b => b.nombre === values.saborBizcocho);
      if (biz) precio += biz.costoAdicional;
    }

    // Rellenos
    values.rellenos.forEach((nombre: string) => {
      const item = this.rellenos.find(r => r.nombre === nombre);
      if (item) precio += item.costoAdicional;
    });
    if (values.otroRelleno?.trim()) this.necesitaCotizacion = true;

    // Toppings
    values.toppings.forEach((nombre: string) => {
      const item = this.toppings.find(t => t.nombre === nombre);
      if (item) precio += item.costoAdicional;
    });
    if (values.otroTopping?.trim()) this.necesitaCotizacion = true;

    // Decorados
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
      if (i >= 0) arr.removeAt(i);
    }
  }

  onSubmit(): void {
  if (!this.authService.estaLogueado()) {
    localStorage.setItem('torta_pendiente', JSON.stringify(this.prepararTorta()));
    alert('Debes iniciar sesión para continuar');
    this.router.navigate(['/iniciar-sesion'], { queryParams: { returnUrl: '/cliente/personalizar-torta' } });
    return;
  }

  // SIEMPRE guarda y va a entrega
  const torta = this.prepararTorta();
  localStorage.setItem('torta_pendiente', JSON.stringify(torta));
  this.router.navigate(['/cliente/entrega']);
}

  private prepararTorta(): any {
    const values = this.form.value;

    // Construir lista completa de adicionales seleccionados
    const adicionalesSeleccionados: any[] = [];

    // Bizcocho
    let bizcochoNombre = values.saborBizcocho;
    let bizcochoAdicional = 0;
    if (values.otroBizcocho?.trim()) {
      bizcochoNombre = values.otroBizcocho.trim();
    } else if (values.saborBizcocho) {
      const biz = this.bizcochos.find(b => b.nombre === values.saborBizcocho);
      if (biz) {
        adicionalesSeleccionados.push(biz);
        bizcochoAdicional = biz.costoAdicional;
      }
    }

    // Rellenos
    values.rellenos.forEach((nombre: string) => {
      const relleno = this.rellenos.find(r => r.nombre === nombre);
      if (relleno) adicionalesSeleccionados.push(relleno);
    });
    if (values.otroRelleno?.trim()) {
      adicionalesSeleccionados.push({
        adicionalId: null,
        nombre: values.otroRelleno.trim(),
        categoria: 'relleno',
        costoAdicional: 0
      });
    }

    // Toppings
    values.toppings.forEach((nombre: string) => {
      const topping = this.toppings.find(t => t.nombre === nombre);
      if (topping) adicionalesSeleccionados.push(topping);
    });
    if (values.otroTopping?.trim()) {
      adicionalesSeleccionados.push({
        adicionalId: null,
        nombre: values.otroTopping.trim(),
        categoria: 'topping',
        costoAdicional: 0
      });
    }

    // Decorados
    values.decorados.forEach((nombre: string) => {
      const decorado = this.decorados.find(d => d.nombre === nombre);
      if (decorado) adicionalesSeleccionados.push(decorado);
    });
    if (values.otroDecorado?.trim()) {
      adicionalesSeleccionados.push({
        adicionalId: null,
        nombre: values.otroDecorado.trim(),
        categoria: 'decorado',
        costoAdicional: 0
      });
    }

    // Descripción completa
    const descripcionCompleta = [
      bizcochoNombre,
      values.rellenos.length > 0 ? `con ${values.rellenos.join(' y ')}` : '',
      values.otroRelleno ? `+ ${values.otroRelleno.trim()}` : '',
      values.toppings.length > 0 ? `+ ${values.toppings.join(', ')}` : '',
      values.otroTopping ? `+ ${values.otroTopping.trim()}` : '',
      values.decorados.length > 0 ? `+ ${values.decorados.join(', ')}` : '',
      values.otroDecorado ? `+ ${values.otroDecorado.trim()}` : '',
      values.instrucciones ? `(Nota: ${values.instrucciones.trim()})` : ''
    ].filter(Boolean).join(' ').trim();

    const costoAdicionales = adicionalesSeleccionados.reduce((sum, a) => sum + (a.costoAdicional || 0), 0);

    return {
      productoId: null,
      nombre: this.necesitaCotizacion ? 'Torta Personalizada (A cotizar)' : 'Torta Personalizada',
      precioBase: 120,
      precioUnitario: this.precioCalculado,
      precioCalculado: this.precioCalculado,
      cantidad: 1,
      categoria: 'torta',
      imagenUrl: 'assets/imagenes/torta-personalizada.jpg',
      esPersonalizada: true,
      necesitaCotizacion: this.necesitaCotizacion,
      descripcionCompleta,
      costoAdicionales,
      adicionales: adicionalesSeleccionados,
      personalizacion: {
        descripcionExtra: descripcionCompleta || 'Torta personalizada',
        costoAdicional: costoAdicionales,
        adicionalesSeleccionados: adicionalesSeleccionados.map(a => a.adicionalId).filter(Boolean)
      }
    };
  }

  regresar() {
    this.location.back();
  }
}
