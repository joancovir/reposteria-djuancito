export interface Resena {
  resenaId: number;
  comentario: string;
  fotoUrl: string;
  valoracion: number;
  fecha: string;
  nombreUsuario: string; // <-- Nuevo campo
  fechaPedido: string;   // <-- Nuevo campo
}