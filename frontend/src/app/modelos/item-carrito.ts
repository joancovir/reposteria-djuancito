export interface ItemCarrito {
  productoId: number;
  nombre: string;
  imagenUrl: string;
  precioBase: number;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;

  promocionId?: number | null;
  nombrePromocion?: string | null;
  descuentoAplicado?: number;     
  esOfertaEspecial?: boolean;      
}