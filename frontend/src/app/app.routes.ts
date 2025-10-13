import { Routes } from '@angular/router';
// Importa los componentes con sus nombres de clase correctos
import { Inicio } from './paginas/inicio/inicio';
import { CatalogoComponent } from './paginas/catalogo/catalogo';
import { RegistroComponent } from './paginas/registro/registro';
import { IniciarSesion } from './paginas/iniciar-sesion/iniciar-sesion';
import { MiPedido } from './paginas/mi-pedido/mi-pedido';
import { Admin } from './disenos/admin/admin';
import { Dashboard } from './paginas/admin/dashboard/dashboard';
import { authGuard } from './guardianes/autenticacion-guard';
// Importa el nuevo diseño de cliente y la página de historial
import { ClienteComponent } from './disenos/cliente/cliente';
import { HistorialPedidos } from './paginas/cliente/historial-pedidos/historial-pedidos';
import { BienvenidaComponent } from './paginas/cliente/bienvenida/bienvenida';
import { PersonalizarTorta } from './paginas/personalizar-torta/personalizar-torta';

export const routes: Routes = [
    // --- RUTAS PÚBLICAS (usan el layout principal) ---
    { path: '', component: Inicio },
    { path: 'catalogo', component: CatalogoComponent },
    { path: 'registrar', component: RegistroComponent },
    { path: 'iniciar-sesion', component: IniciarSesion },
    { path: 'personalizar-torta', component: PersonalizarTorta },

    // --- RUTAS PROTEGIDAS ---
    {
      path: 'mi-pedido',component: MiPedido },

    // --- SECCIÓN DE ADMINISTRACIÓN  ---
    {
      path: 'admin',
      component: Admin, 
      canActivate: [authGuard],
      children: [ 
        { path: 'dashboard', component: Dashboard},
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' } 
      ]
    },
{
  path: 'cliente',
  component: ClienteComponent,
  canActivate: [authGuard],
  children: [
    { path: 'bienvenida', component: BienvenidaComponent }, 
    { path: 'pedidos', component: HistorialPedidos },
    { path: 'catalogo', component: CatalogoComponent }, 
    { path: '', redirectTo: 'bienvenida', pathMatch: 'full' } 
  ]},
    { path: '**', redirectTo: '', pathMatch: 'full' }
];