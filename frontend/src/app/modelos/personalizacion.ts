import { Adicional } from './adicional'; 

export interface Personalizacion {
  personalizacionId: number;
  descripcionExtra?: string; 
  costoAdicional: number;
adicionalesSeleccionados?: Adicional[];
}