
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { Usuario } from '../../../modelos/usuario'; 
import { UsuarioService } from '../../../servicios/usuario'; 
import { PasswordChangeDTO } from '../../../modelos/password-change-dto';
// Función validadora (la misma que en MiPerfilComponent)
function passwordMatchValidator(form: FormGroup) {
  const password = form.get('nuevaPassword');
  const confirmPassword = form.get('confirmarPassword');
  if (!password || !confirmPassword || !password.value || !confirmPassword.value) {
    return null;
  }
  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-admin-perfil', 
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule 
  ],
  templateUrl: './admin-perfil.html', 
  styleUrl: './admin-perfil.css'
})
export class AdminPerfil implements OnInit { 
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
    
    // Llama al mismo servicio que usa el cliente
    this.usuarioService.obtenerMiPerfil().subscribe({ 
      next: (data) => {
        this.usuarioOriginal = data; 
        this.perfilForm.patchValue({
          nombre: data.nombre,
          email: data.email,
          telefono: data.telefono || '', 
          direccion: data.direccion || '' 
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar el perfil del admin:', err);
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

    const datosActualizados: Usuario = {
      ...this.usuarioOriginal, 
      nombre: this.perfilForm.value.nombre,
      telefono: this.perfilForm.value.telefono,
      direccion: this.perfilForm.value.direccion
    };

    // Llama al mismo servicio que usa el cliente
    this.usuarioService.actualizarMiPerfil(datosActualizados).subscribe({ 
      next: (usuarioActualizado) => {
        this.usuarioOriginal = usuarioActualizado; 
        this.perfilForm.patchValue({ 
          nombre: usuarioActualizado.nombre,
          telefono: usuarioActualizado.telefono || '',
          direccion: usuarioActualizado.direccion || ''
        });
        this.isSavingPerfil = false;
        this.exitoMensajePerfil = '¡Perfil actualizado con éxito!';
        setTimeout(() => this.exitoMensajePerfil = null, 3000);
      },
      error: (err) => {
        console.error('Error al guardar el perfil del admin:', err);
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
        this.exitoMensajePassword = respuesta || 'Contraseña cambiada con éxito.';
        this.passwordForm.reset();
        setTimeout(() => this.exitoMensajePassword = null, 4000);
      },
      error: (err) => {
        console.error('Error al cambiar contraseña (admin):', err);
        this.errorMensajePassword = err.error || 'Error inesperado al cambiar la contraseña.';
        this.isSavingPassword = false;
      }
    });
  }

  // --- Helpers para errores (idénticos a MiPerfilComponent) ---
  isControlInvalid(form: FormGroup, controlName: string): boolean {
     // ... (código idéntico) ...
    const control = form.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
  getControlError(form: FormGroup, controlName: string, errorName: string): boolean {
     // ... (código idéntico) ...
    const control = form.get(controlName);
    return !!control && control.hasError(errorName);
  }
   getPasswordFormError(errorName: string): boolean {
     // ... (código idéntico) ...
     return this.passwordForm.hasError(errorName) && (this.passwordForm.get('confirmarPassword')?.touched ?? false);
   }
}