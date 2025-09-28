import { Component } from '@angular/core';
import { ProductosDestacados } from '../../componentes/productos-destacados/productos-destacados';
import { Resenas} from '../../componentes/resenas/resenas';
import { Contacto } from '../../componentes/contacto/contacto';
import { RouterLink } from '@angular/router'; 
import { LlamadaACatalogo } from '../../componentes/llamada-a-catalogo/llamada-a-catalogo'; // <--- (Asegúrate que el nombre del archivo es 'llamada-a-catalogo.ts')

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, ProductosDestacados, Resenas, Contacto, LlamadaACatalogo],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio {

}
