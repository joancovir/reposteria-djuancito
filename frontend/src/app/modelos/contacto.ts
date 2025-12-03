
export interface Contacto {
  contactoId: number;
  nombre: string;
  telefono: string;
  email: string;
  mensaje: string;
  fecha: string; 
  estado: 'pendiente' | 'respondido';
  motivo: 'cotizacion' | 'soporte' | 'general';
  respuesta?: string;    
  fechaRespuesta?: string;
}