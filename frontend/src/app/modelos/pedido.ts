// Ruta sugerida: src/app/modelos/pedido.ts
export interface Pedido {
  pedidoId: number;
  usuarioId: number; // Esto se mantendrá si solo mapeas el ID
  fechaPedido: string;
  estado: string;
  total: number;
  // Añade todos los demás campos de tu Entidad Pedido.java
}