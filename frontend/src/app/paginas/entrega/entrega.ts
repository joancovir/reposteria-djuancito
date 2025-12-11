// src/app/paginas/cliente/entrega/entrega.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutenticacionService } from '../../servicios/autenticacion';
import { PedidoService } from '../../servicios/pedido';
import { Router } from '@angular/router';
import { ConfigTienda, TiendaService } from '../../servicios/tienda';
import { UrlSeguraPipe } from '../../tuberías/url-segura.pipe';

@Component({
  selector: 'app-entrega',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UrlSeguraPipe],
  templateUrl: './entrega.html',
  styleUrls: ['./entrega.css']
})
export class Entrega implements OnInit {
  entregaForm!: FormGroup;
  usuario: any = null;
  tortaPersonalizada: any = null;
tienda: ConfigTienda = {
  nombreTienda: 'Cargando...',
  direccion: 'calle arrospedi num. 164',
  referencia: 'urb caja de deposito',
  telefono: '960561420',
  googleMapsEmbed: '',
  latitud: -12.130022,
  longitud: -77.030722
};
  constructor(
    private fb: FormBuilder,
    private auth: AutenticacionService,
    private pedidoService: PedidoService,
    private tiendaService: TiendaService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    // 1. Verificar login
    if (!this.auth.estaLogueado()) {
      this.router.navigate(['/iniciar-sesion'], { queryParams: { returnUrl: '/cliente/entrega' } });
      return;
    }

    this.usuario = this.auth.obtenerUsuarioActual();

    // 2. Cargar datos de la tienda
    this.tiendaService.obtenerConfig().subscribe({
      next: (data) => this.tienda = data,
      error: () => console.log('Tienda no cargada, usando valores por defecto')
    });

    // 3. Recuperar torta personalizada
    const guardada = localStorage.getItem('torta_pendiente');
    if (!guardada) {
      alert('No hay torta seleccionada');
      this.router.navigate(['/cliente/personalizar-torta']);
      return;
    }

    this.tortaPersonalizada = JSON.parse(guardada);
    localStorage.removeItem('torta_pendiente');

    // 4. Formulario de entrega
    this.entregaForm = this.fb.group({
      metodo: ['delivery', Validators.required],
      direccionEntrega: [this.usuario?.direccion || '', Validators.required],
      referencia: [''],
      fechaEntrega: ['', Validators.required]
    });

    // Cambiar validación según método
    this.entregaForm.get('metodo')?.valueChanges.subscribe(metodo => {
      const dirControl = this.entregaForm.get('direccionEntrega');
      if (metodo === 'recojo') {
        dirControl?.clearValidators();
        dirControl?.setValue(this.tienda.direccion);
      } else {
        dirControl?.setValidators(Validators.required);
      }
      dirControl?.updateValueAndValidity();
    });
  }

onSubmit() {
  if (this.entregaForm.invalid || !this.tortaPersonalizada) return;

  const form = this.entregaForm.value;

  // RECUPERAR LOS ADICIONALES QUE YA TENEMOS GUARDADOS
  const adicionales = this.tortaPersonalizada.adicionales || [];

  const detalle: any = {
    productoId: null,
    cantidad: 1,
    precioUnitario: Number(this.tortaPersonalizada.precioCalculado?.toFixed(2) || 0),
    subtotal: Number(this.tortaPersonalizada.precioCalculado?.toFixed(2) || 0),
    promocionId: null,
    personalizacion: {
      descripcionExtra: this.tortaPersonalizada.descripcionCompleta || 'Torta personalizada',
      costoAdicional: this.tortaPersonalizada.costoAdicionales || 0,
      // AQUÍ ESTÁ EL FIX: SOLO ENVÍAS LOS IDs, NADA MÁS
      adicionalesSeleccionados: adicionales
        .map((a: any) => a.adicionalId)
        .filter((id: any) => id !== null && id !== undefined)
    }
  };

  const pedidoDto: any = {
    usuarioId: this.usuario.usuarioId,
    nota: `Torta Personalizada - ${form.metodo === 'recojo' ? 'RECOJO EN TIENDA' : 'DELIVERY'}\n` +
          `Fecha: ${form.fechaEntrega}\n` +
          (form.metodo === 'delivery'
            ? `Dirección: ${form.direccionEntrega}\nReferencia: ${form.referencia || 'Sin referencia'}`
            : `Recojo en: ${this.tienda.direccion}`),
    detalles: [detalle],
    subtotal: Number(this.tortaPersonalizada.precioCalculado?.toFixed(2) || 0),
    total: Number(this.tortaPersonalizada.precioCalculado?.toFixed(2) || 0),
    garantiaPagada: 0,
    resto: Number(this.tortaPersonalizada.precioCalculado?.toFixed(2) || 0)
  };

  console.log('PEDIDO ENVIADO:', JSON.stringify(pedidoDto, null, 2));

  this.pedidoService.crear(pedidoDto).subscribe({
    next: (pedido: any) => {
      const entregaData = {
        pedidoId: pedido.pedidoId,
        direccionEntrega: form.metodo === 'recojo' ? this.tienda.direccion : form.direccionEntrega,
        referencia: form.referencia || null,
        fechaEntrega: form.fechaEntrega,
        metodo: form.metodo.toUpperCase() as 'DELIVERY' | 'RECOJO',
        estado: 'PENDIENTE'
      };

      this.pedidoService.crearEntrega(entregaData).subscribe({
        next: () => {
          // LIMPIAR todo
          localStorage.removeItem('torta_pendiente');
          localStorage.setItem('pedido_actual_id', pedido.pedidoId.toString());
          localStorage.setItem('pago_garantia', JSON.stringify({
            garantia: 0,
            resto: this.tortaPersonalizada.precioCalculado,
            subtotal: this.tortaPersonalizada.precioCalculado
          }));
          this.router.navigate(['/cliente/pago-garantia']);
        },
        error: (err) => {
          console.error('Error entrega:', err);
          alert('Error al guardar datos de entrega');
        }
      });
    },
    error: (err) => {
      console.error('Error al crear pedido:', err);
      alert('Error al crear el pedido: ' + (err.error?.mensaje || 'Intenta de nuevo'));
    }
  });
}

  regresar() {
    this.location.back();
  }
}
