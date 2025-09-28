
import { Usuario } from './usuario'; 
import { Pedido } from './pedido';
export interface Resena {
resenaId: number;
usuarioId: number; 
pedidoId: number;  
comentario: string;
fotoUrl: string;
valoracion: number; 
fecha: string;      
usuario: Usuario; 
pedido: Pedido;
estado: 'pendiente' | 'aprobado' | 'rechazado';
}