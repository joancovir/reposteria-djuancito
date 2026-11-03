import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario';
import { AutenticacionService } from '../../servicios/autenticacion';

@Component({
  selector: 'app-iniciar-sesion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './iniciar-sesion.html',
  styleUrl: './iniciar-sesion.css'
})
export class IniciarSesion implements OnInit {
  loginForm: FormGroup;
  defaultClientUrl: string = '/cliente/pedidos';
  cargando: boolean = false;
  mensajeError: string = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private authService: AutenticacionService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.cargando = true;
      this.mensajeError = '';

      this.usuarioService.login(this.loginForm.value).subscribe({
        next: (respuesta: any) => {
          this.authService.guardarSesion(respuesta.token);

          this.usuarioService.obtenerMiPerfil().subscribe({
            next: (usuarioCompleto: any) => {
              this.authService.guardarUsuarioCompleto(usuarioCompleto);

              this.limpiarModalesResiduales();

              const esAdmin = this.authService.userHasRole('Administrador');
              let ruta: string;

              if (esAdmin) {
                ruta = '/admin/dashboard';
              } else {
                const returnUrl = this.route.snapshot.queryParams['returnUrl'];
                const redirectStorage = localStorage.getItem('redirect_after_login');
                localStorage.removeItem('redirect_after_login');

                ruta = returnUrl || redirectStorage || this.defaultClientUrl;
              }

              this.router.navigate([ruta]);
            },
            error: () => {
              this.cargando = false;
              this.mensajeError = 'Error al cargar tu perfil. Intenta más tarde.';
            }
          });
        },
        error: (err) => {
          this.cargando = false;
          this.mensajeError = err.error?.message || 'Credenciales inválidas. Verifica tu correo y contraseña.';
        }
      });
    }
  }

  private limpiarModalesResiduales(): void {
    const backdrops = this.document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(b => b.remove());
    this.document.body.classList.remove('modal-open');
    this.document.body.style.removeProperty('overflow');
    this.document.body.style.removeProperty('padding-right');
  }
}