
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { Usuario } from '../../../modelos/usuario'; 
import { UsuarioService } from '../../../servicios/usuario'; 
import { PasswordChangeDTO } from '../../../modelos/password-change-dto';
function passwordMatchValidator(form: FormGroup) {
  const password = form.get('nuevaPassword');
  const confirmPassword = form.get('confirmarPassword');
  if (!password || !confirmPassword || !password.value || !confirmPassword.value) {
    return null;
  }
  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
}


@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule 
  ],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css'
})
export class MiPerfil implements OnInit {

  perfilForm: FormGroup; 
  passwordForm: FormGroup; 

  usuarioOriginal: Usuario | null = null;
  isLoading = true;
  isSavingPerfil = false;
  isSavingPassword = false;
  errorMensajePerfil: string | null = null;
  exitoMensajePerfil: string | null = null;
  errorMensajePassword: string | null = null;
  exitoMensajePassword: string | null = null;

  private usuarioService = inject(UsuarioService);
  private fb = inject(FormBuilder);

  constructor() {
    this.perfilForm = this.fb.group({
      nombre: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]], 
      telefono: ['', [Validators.pattern('^[0-9]{9}$')]],
      direccion: ['']
    });

    this.passwordForm = this.fb.group({
      passwordActual: ['', Validators.required],
      nuevaPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator }); 
  }


  ngOnInit(): void {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario(): void {
    this.isLoading = true;
    this.errorMensajePerfil = null;
    
    this.usuarioService.obtenerMiPerfil().subscribe({
      next: (data) => {
        this.usuarioOriginal = data; // Guarda los datos originales
        // Rellena el formulario con los datos recibidos
        this.perfilForm.patchValue({
          nombre: data.nombre,
          email: data.email,
          telefono: data.telefono || '', // Usa '' si es null/undefined
          direccion: data.direccion || '' 
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar el perfil:', err);
        this.errorMensajePerfil = 'No se pudieron cargar tus datos. Intenta de nuevo.';
        this.isLoading = false;
      }
    });
  }

  guardarPerfil(): void {
    if (this.perfilForm.invalid || !this.usuarioOriginal) return;

    this.isSavingPerfil = true;
    this.errorMensajePerfil = null;
    this.exitoMensajePerfil = null;

    // Crea el objeto a enviar, combinando ID original con datos del form
    const datosActualizados: Usuario = {
      ...this.usuarioOriginal, // Mantiene ID, roles, etc.
      nombre: this.perfilForm.value.nombre,
      telefono: this.perfilForm.value.telefono,
      direccion: this.perfilForm.value.direccion
    };

    this.usuarioService.actualizarMiPerfil(datosActualizados).subscribe({
      next: (usuarioActualizado) => {
        this.usuarioOriginal = usuarioActualizado; // Actualiza los datos base
        this.perfilForm.patchValue({ // Actualiza el formulario por si acaso
           nombre: usuarioActualizado.nombre,
           telefono: usuarioActualizado.telefono || '',
           direccion: usuarioActualizado.direccion || ''
        });
        this.isSavingPerfil = false;
        this.exitoMensajePerfil = '¡Perfil actualizado con éxito!';
        setTimeout(() => this.exitoMensajePerfil = null, 3000);
      },
      error: (err) => {
        console.error('Error al guardar el perfil:', err);
        this.errorMensajePerfil = 'No se pudieron guardar los cambios. Intenta de nuevo.';
        this.isSavingPerfil = false;
      }
    });
  }

cambiarPassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.isSavingPassword = true;
    this.errorMensajePassword = null;
    this.exitoMensajePassword = null;

    // --- ¡LÓGICA ACTUALIZADA AQUÍ! ---
    const passwordData: PasswordChangeDTO = {
      passwordActual: this.passwordForm.value.passwordActual,
      nuevaPassword: this.passwordForm.value.nuevaPassword
    };

    this.usuarioService.cambiarPassword(passwordData).subscribe({
      next: (respuesta) => {
        this.isSavingPassword = false;
        // Asumiendo que el backend devuelve un mensaje de éxito en el body
        this.exitoMensajePassword = respuesta || 'Contraseña cambiada con éxito.';
        this.passwordForm.reset();
        setTimeout(() => this.exitoMensajePassword = null, 4000); // Muestra por 4 segundos
      },
      error: (err) => {
        console.error('Error al cambiar contraseña:', err);
        // El backend devuelve el mensaje de error en 'error' si es 400, o un objeto si es 500
        this.errorMensajePassword = err.error || 'Error inesperado al cambiar la contraseña.';
        this.isSavingPassword = false;
      }
    });
  }

  // --- Helpers para mostrar errores de validación en HTML ---
  isControlInvalid(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getControlError(form: FormGroup, controlName: string, errorName: string): boolean {
    const control = form.get(controlName);
    return !!control && control.hasError(errorName);
  }

  getPasswordFormError(errorName: string): boolean {
    return this.passwordForm.hasError(errorName) && (this.passwordForm.get('confirmarPassword')?.touched ?? false);
  }
}