import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutenticacionService } from '../../servicios/autenticacion';
import { PedidoService } from '../../servicios/pedido';
import { Router } from '@angular/router';
import { ConfigTienda, TiendaService } from '../../servicios/tienda';
import { UrlSeguraPipe } from '../../tuberías/url-segura.pipe';
import { DetalleRequestDTO, PedidoRequestDTO } from '../../modelos/pedido-request-dto';
@Component({
  selector: 'app-entrega',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UrlSeguraPipe],
  templateUrl: './entrega.html',
  styleUrl: './entrega.css'
})
export class Entrega implements OnInit {

  entregaForm!: FormGroup;
  usuario: any = null;
  tortaPersonalizada: any = null;

  tienda: ConfigTienda = {
    nombreTienda: 'Cargando...',
    direccion: 'Av. Larco 123, Miraflores',
    referencia: 'Frente al Parque Kennedy',
    telefono: '999 999 999',
    googleMapsEmbed: ''
  };

  constructor(
    private fb: FormBuilder,
    private auth: AutenticacionService,
    private pedidoService: PedidoService,
    private tiendaService: TiendaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1. Verificar login
    if (!this.auth.estaLogueado()) {
      this.router.navigate(['/iniciar-sesion'], { queryParams: { returnUrl: '/cliente/entrega' } });
      return;
    }

    this.usuario = this.auth.obtenerUsuarioActual(); // ← AHORA TRAE DIRECCIÓN

    // 2. Cargar datos de la tienda
    this.tiendaService.obtenerConfig().subscribe({
      next: (data) => this.tienda = data,
      error: () => console.log('Tienda no cargada, usando valores por defecto')
    });

    // 3. Recuperar torta personalizada del localStorage
    const guardada = localStorage.getItem('torta_pendiente');
    if (!guardada) {
      alert('No hay torta seleccionada');
      this.router.navigate(['/cliente/personalizar-torta']);
      return;
    }
    this.tortaPersonalizada = JSON.parse(guardada);
    localStorage.removeItem('torta_pendiente');

    // 4. Formulario
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

  // RECREAMOS LOS ADICIONALES COMPLETOS (como en el carrito)
  const adicionalesCompletos = (this.tortaPersonalizada.adicionales || []).map((ad: any) => ({
    adicionalId: ad.adicionalId,
    nombre: ad.nombre,
    categoria: ad.categoria || 'Extra',
    costoAdicional: ad.costoAdicional || ad.precio || 0
  }));

  const detalle: DetalleRequestDTO = {
    productoId: null, // torta personalizada no tiene productoId
    cantidad: 1,
    precioUnitario: Number(this.tortaPersonalizada.precioCalculado?.toFixed(2) || 0),
    subtotal: Number(this.tortaPersonalizada.precioCalculado?.toFixed(2) || 0),
    promocionId: null,
    personalizacion: {
      descripcionExtra: this.tortaPersonalizada.descripcionCompleta ||
        `Torta ${this.tortaPersonalizada.pisos} piso(s) de ${this.tortaPersonalizada.sabor} con relleno de ${this.tortaPersonalizada.relleno}`,
      costoAdicional: this.tortaPersonalizada.costoAdicionales || 0,
      adicionalesSeleccionados: adicionalesCompletos // AQUÍ ESTÁ LA MAGIA
    }
  };

  const pedidoDto: PedidoRequestDTO = {
    usuarioId: this.usuario.usuarioId,
    nota: `Torta Personalizada - ${form.metodo === 'recojo' ? 'RECOJO EN TIENDA' : 'DELIVERY'}\n` +
          `Fecha: ${form.fechaEntrega}\n` +
          (form.metodo === 'delivery' ? `Dirección: ${form.direccionEntrega}\nReferencia: ${form.referencia || 'Sin referencia'}` : ''),
    detalles: [detalle],
    subtotal: Number(this.tortaPersonalizada.precioCalculado?.toFixed(2) || 0),
    total: Number(this.tortaPersonalizada.precioCalculado?.toFixed(2) || 0),
    garantiaPagada: 0,
    resto: Number(this.tortaPersonalizada.precioCalculado?.toFixed(2) || 0)
  };

  console.log('ENVIANDO TORTA PERSONALIZADA:', JSON.stringify(pedidoDto, null, 2));

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
          localStorage.setItem('pedido_actual_id', pedido.pedidoId.toString());
          localStorage.setItem('pago_garantia', JSON.stringify({
            garantia: 0,
            resto: this.tortaPersonalizada.precioCalculado,
            subtotal: this.tortaPersonalizada.precioCalculado
          }));
          this.router.navigate(['/cliente/pago-garantia']);
        },
        error: (err) => alert('Error al guardar entrega: ' + (err.error?.mensaje || 'Intenta de nuevo'))
      });
    },
    error: (err) => {
      console.error('Error creando pedido personalizado:', err);
      alert('Error: ' + (err.error?.mensaje || 'No se pudo crear el pedido'));
    }
  });
}
