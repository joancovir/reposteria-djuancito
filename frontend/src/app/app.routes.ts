import { Routes } from '@angular/router';
import { Inicio } from './paginas/inicio/inicio';
import { Catalogo} from './paginas/catalogo/catalogo';
export const routes: Routes = [
    
    // Rutas Principales
    { path: '', component: Inicio }, 
    { path: 'catalogo', component: Catalogo }, 

    // Rutas temporales que redirigen al inicio (mientras las construyes)
    { path: 'productos-realizados', redirectTo: '', pathMatch: 'full' },
    { path: 'promociones', redirectTo: '', pathMatch: 'full' },
    { path: 'mi-pedido', redirectTo: '', pathMatch: 'full' },
    { path: 'registrar', redirectTo: '', pathMatch: 'full' },
    { path: 'iniciar-sesion', redirectTo: '', pathMatch: 'full' },

    // Una ruta "comodín" para redirigir a inicio si la URL no existe
    { path: '**', redirectTo: '', pathMatch: 'full' }
];