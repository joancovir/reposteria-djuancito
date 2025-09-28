import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header} from './componentes/header/header';
import { BarraAnuncios} from './componentes/barra-anuncios/barra-anuncios'; // <-- Añade esta línea
import { PiePagina } from './componentes/pie-pagina/pie-pagina'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, PiePagina, BarraAnuncios], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'frontend';
}