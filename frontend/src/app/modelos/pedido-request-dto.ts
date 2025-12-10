// src/app/modelos/pedido-request-dto.ts

export interface PersonalizacionDTO {
  descripcionExtra?: string;
  costoAdicional?: number;
  adicionalesSeleccionados?: Array<{
    adicionalId: number | null;
    nombre: string;
    categoria: string;
    costoAdicional: number;
  }>;
}

export interface DetalleRequestDTO {
  productoId: number | null;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  promocionId?: number | null;
  personalizacion?: PersonalizacionDTO;
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
