// src/app/app.ts
import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Header } from './componentes/header/header';
import { PiePagina } from './componentes/pie-pagina/pie-pagina';
import { ToastComponent } from './componentes/toast/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    Header,
    PiePagina,
    ToastComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  usaLayoutPrincipal = true;
  mostrarToast = false;
  mensajeToast = '';

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.usaLayoutPrincipal = 
        !event.urlAfterRedirects.startsWith('/admin') && 
        !event.urlAfterRedirects.startsWith('/cliente');
    });

    window.addEventListener('agregar-al-carrito', (e: any) => {
      this.mostrarNotificacion(e.detail);
    });
  }

  mostrarNotificacion(mensaje: string) {
    this.mensajeToast = mensaje;
    this.mostrarToast = true;
    setTimeout(() => this.mostrarToast = false, 3000);
  }
}