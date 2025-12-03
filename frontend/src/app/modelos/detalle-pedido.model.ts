import { Producto } from './producto';

export interface DetallePedido {
  productoId: number;
  cantidad: number;
  precioUnitario?: number;
  subtotal?: number;
}