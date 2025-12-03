export interface DetalleRequestDTO {
  productoId?: number | null;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  personalizacion?: {
    descripcionExtra?: string;
    costoAdicional?: number;
  };
}

export interface PedidoRequestDTO {
  usuarioId: number;
  nota?: string;
  detalles: DetalleRequestDTO[];
  subtotal: number;
  total: number;
  garantiaPagada: number;
  resto: number;
}