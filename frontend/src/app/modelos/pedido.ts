
import { Usuario } from './usuario';
import { DetallePedido } from './detalle-pedido';
import { Pago } from './pago';

export interface Pedido {
  pedidoId: number;
  usuario?: Usuario; 
  fechaPedido: string; 
  estado: string; 
  total: number;
  nota?: string; 
  detalles?: DetallePedido[]; 
  pagos?: Pago[]; 
  montoGarantia?: number; 
}