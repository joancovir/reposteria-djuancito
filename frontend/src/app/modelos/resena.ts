
 import { Usuario } from './usuario';
 import { Pedido } from './pedido';
import { EstadoResena } from '../servicios/resena';

 export interface Resena {
   resenaId: number;
   usuario?: Usuario; 
   pedido?: Pedido; 
   comentario: string;
   fotoUrl?: string;
   valoracion: number; 
   fecha: string; 
   estado: EstadoResena | string; 
 
 }