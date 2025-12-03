export interface Temporada {

temporadaId: number; 
nombre: string;
descripcion?: string; 
fechaInicio: string; 
fechaFin: string; 
estado: 'activo' | 'inactivo';

}