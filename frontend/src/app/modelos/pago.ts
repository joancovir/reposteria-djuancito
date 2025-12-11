
export type MetodoPago = 'PENDIENTE' | 'yape' | 'plin' | 'efectivo';  // AÑADIDO PENDIENTE

export type EstadoPago = 'pendiente_validacion' | 'validado' | 'rechazado';

export type TipoPago = 'GARANTIA' | 'SALDO' | 'TOTAL';

export interface Pago {
  pagoId: number;
  pedidoId?: number;
  montoAbonado: number;
  fechaPago: string;
  metodo: MetodoPago;
  codigoOperacion?: string;
  comprobanteUrl?: string;
  estado: EstadoPago;
  tipoPago?: TipoPago;  // <-- ÚNICO, sin duplicado
}
