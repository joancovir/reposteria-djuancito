
import { Routes } from '@angular/router';
import { Inicio } from './paginas/inicio/inicio';
import { CatalogoComponent } from './paginas/catalogo/catalogo';
import { RegistroComponent } from './paginas/registro/registro';
import { IniciarSesion } from './paginas/iniciar-sesion/iniciar-sesion';
import { MiPedido } from './paginas/mi-pedido/mi-pedido';
import { Admin } from './disenos/admin/admin';
import { Dashboard } from './paginas/admin/dashboard/dashboard';
import { authGuard } from './guardianes/autenticacion-guard';
import { ClienteComponent } from './disenos/cliente/cliente';
import { HistorialPedidos } from './paginas/cliente/historial-pedidos/historial-pedidos';
import { Bienvenida } from './paginas/cliente/bienvenida/bienvenida';
import { PersonalizarTorta } from './paginas/personalizar-torta/personalizar-torta';
import { ProductosDestacados } from './componentes/productos-destacados/productos-destacados';
import { GestionGarantias } from './paginas/admin/gestion-garantias/gestion-garantias';
import { MiPerfil } from './paginas/cliente/mi-perfil/mi-perfil';
import { MisConsultas } from './paginas/cliente/mis-consultas/mis-consultas';
import { GestionQr } from './paginas/admin/gestion-qr/gestion-qr';
import { GestionPedidos } from './paginas/admin/gestion-pedidos/gestion-pedidos';
import { GestionConsultas } from './paginas/admin/gestion-consultas/gestion-consultas';
import { GestionUsuarios } from './paginas/admin/gestion-usuarios/gestion-usuarios';
import { AdminPerfil } from './paginas/admin/admin-perfil/admin-perfil'; 
import { GestionProductos } from './paginas/admin/gestion-productos/gestion-productos';
import { GestionPagos } from './paginas/admin/gestion-pagos/gestion-pagos';
import { GestionAdicionales } from './paginas/admin/gestion-adicionales/gestion-adicionales';
import { GestionPromociones } from './paginas/admin/gestion-promociones/gestion-promociones';
import { GestionResenas } from './paginas/admin/gestion-resenas/gestion-resenas';
import { Checkout} from './paginas/cliente/checkout/checkout';
import { ConfirmarPedidoPage } from './paginas/confirmar-pedido/confirmar-pedido';
import { PagoGarantia} from './paginas/pago-garantia/pago-garantia'; 
import { ProductosRealizados } from './componentes/productos-realizados/productos-realizados';
import { PromocionesTemporadas } from './componentes/promociones-temporadas/promociones-temporadas';
import { DetallePromocionComponent } from './componentes/detalle-promocion/detalle-promocion'; 
import { Entrega} from './paginas/entrega/entrega'; 
import { DetalleConsultaModal } from './componentes/detalle-consulta-modal/detalle-consulta-modal'; 

export const routes: Routes = [

    { path: '', component: Inicio },
    { path: 'catalogo', component: CatalogoComponent },
    { path: 'registrar', component: RegistroComponent },
    { path: 'iniciar-sesion', component: IniciarSesion },
    { path: 'personalizar-torta', component: PersonalizarTorta },
    { path: 'mi-pedido',component: MiPedido },    
    { path: 'checkout',component: Checkout},
    { path: 'productos-realizados', component: ProductosRealizados},
    { path: 'ofertas', component: PromocionesTemporadas },
    { path: 'ofertas/:id', component: DetallePromocionComponent }, 
    { path: 'entrega', component: Entrega },



    {
      path: 'admin',
      component: Admin, 
      canActivate: [authGuard],
      data: { roles: ['ROLE_Administrador'] }, 
      children: [ 
        { path: 'dashboard', component: Dashboard },
        
        { path: 'pedidos', component: GestionPedidos },
        { path: 'consultas', component: GestionConsultas },
        { path: 'usuarios', component: GestionUsuarios },
        { path: 'perfil', component: AdminPerfil }, 
        { path: 'pagos', component: GestionPagos },
        { path: 'productos', component: GestionProductos },
        { path: 'adicionales', component: GestionAdicionales }, 
        { path: 'promociones', component: GestionPromociones },
        { path: 'resenas', component: GestionResenas },
        { path: 'productos/:idProducto', component: GestionProductos }, 
        { path: 'GestionGarantias', component: GestionGarantias }, 
        { path: 'GestionQr', component: GestionQr }, 

        { path: '', redirectTo: 'dashboard', pathMatch: 'full' } 
      ]
    },
    {
      path: 'cliente',
      component: ClienteComponent,
      canActivate: [authGuard],
      children: [
        { path: 'bienvenida', component: Bienvenida}, 
        { path: 'pedidos', component: HistorialPedidos },
        { path: 'catalogo', component: CatalogoComponent }, 
        { path: 'personalizar-torta', component: PersonalizarTorta },
        { path: 'productos-destacados', component: ProductosDestacados },
        { path: 'mi-pedido', component: MiPedido }, 
        { path: 'perfil', component: MiPerfil }, 
        { path: 'confirmar-pedido', component: ConfirmarPedidoPage }, 
        { path: 'consultas', component: MisConsultas },
        { path: 'pago-garantia', component: PagoGarantia }, 
        { path: 'productos-realizados', component: ProductosRealizados},
        { path: 'entrega', component: Entrega },
        { path: 'historial-pedidos', component: HistorialPedidos},
        { path: 'ofertas', component: PromocionesTemporadas },
        { path: 'ofertas/:id', component: DetallePromocionComponent }, 
        { path: 'detalle/:contactoId', component: DetalleConsultaModal },



        { path: '', redirectTo: 'bienvenida', pathMatch: 'full' } 
      ]
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];