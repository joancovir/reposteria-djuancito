import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Header } from './componentes/header/header';
import { PiePagina} from './componentes/pie-pagina/pie-pagina';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ CommonModule, RouterOutlet, Header, PiePagina ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Nueva variable: será 'true' si estamos en una página pública
  usaLayoutPrincipal = true;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Si la URL NO empieza con /admin Y NO empieza con /cliente, entonces SÍ usamos el layout principal.
      this.usaLayoutPrincipal = !event.urlAfterRedirects.startsWith('/admin') && !event.urlAfterRedirects.startsWith('/cliente');
    });
  }
}