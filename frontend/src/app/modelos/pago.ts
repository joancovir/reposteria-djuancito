export type MetodoPago = 'PENDIENTE' | 'yape' | 'plin' | 'efectivo';
export type EstadoPago = 'pendiente_validacion' | 'validado' | 'rechazado';
export type TipoPago = 'GARANTIA' | 'SALDO_FINAL' | 'COMPLETO';

export interface Pago {
  pagoId: number;
  pedidoId?: number;
  montoAbonado: number;
  fechaPago: string;
  metodo: MetodoPago;                    // ← Ahora incluye 'PENDIENTE'
  codigoOperacion?: string | null;
  comprobanteUrl?: string | null;
  estado: EstadoPago;
  tipoPago?: TipoPago | null;
}
