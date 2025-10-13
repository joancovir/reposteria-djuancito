export interface Rol {
  rolId: number;
  nombre: string;
}
export interface Usuario {
  usuarioId: number;
  nombre: string;
  email: string;
  roles: Rol[]; 
}