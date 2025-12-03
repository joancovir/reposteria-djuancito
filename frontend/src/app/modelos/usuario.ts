import { PasswordChangeDTO } from './password-change-dto';
export interface Rol {
  rolId: number;
  nombre: string;
}
export interface Usuario {
  usuarioId: number;
  nombre: string;
  email: string;
  roles: Rol[]; 
  telefono?: string;
  direccion?: string;
  tipoCliente?: string;
  estado?: string;
  fechaRegistro?: string;
  password: string;
}