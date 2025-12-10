// src/app/paginas/admin/gestion-qr/gestion-qr.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../../src/environments/environment';

interface QrPago {
  id?: number;
  tipo: 'YAPE' | 'PLIN';
  imagenUrl: string;
  telefono: string;
  nombrePropietario: string;
  activo: boolean;
}

@Component({
  selector: 'app-gestion-qr',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './gestion-qr.html',
  styleUrls: ['./gestion-qr.css']
})
export class GestionQr implements OnInit {
  qrs: QrPago[] = [];
  modalVisible = false;
  esEdicion = false;
  form: QrPago = {
    tipo: 'YAPE',
    imagenUrl: '',
    telefono: '999675771',
    nombrePropietario: 'Jessica Chuñe Liza',
    activo: true
  };
  imagenPreview = '';
  archivoSeleccionado: File | null = null; // ← NUEVO

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  ngOnInit() {
    this.cargarQrs();
  }

  cargarQrs() {
    this.http.get<QrPago[]>(`${this.apiUrl}/config/qr/admin`).subscribe({
      next: (data) => this.qrs = data,
      error: (err) => console.error('Error cargando QRs:', err)
    });
  }

  abrirModal(qr?: QrPago) {
    if (qr) {
      this.esEdicion = true;
      this.form = { ...qr };
      this.imagenPreview = qr.imagenUrl;
      this.archivoSeleccionado = null;
    } else {
      this.esEdicion = false;
      this.form = {
        tipo: 'YAPE',
        imagenUrl: '',
        telefono: '999675771',
        nombrePropietario: 'Jessica Chuñe Liza',
        activo: true
      };
      this.imagenPreview = '';
      this.archivoSeleccionado = null;
    }
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
    this.archivoSeleccionado = null;
    this.imagenPreview = '';
  }

  // AQUÍ ESTÁ LA MAGIA: SUBE LA IMAGEN A TU CLOUDINARY
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.archivoSeleccionado = file;

    // Vista previa inmediata
    const reader = new FileReader();
    reader.onload = () => this.imagenPreview = reader.result as string;
    reader.readAsDataURL(file);
  }

  guardar() {
    if (!this.archivoSeleccionado && !this.esEdicion) {
      alert('¡Debes subir una imagen del QR!');
      return;
    }

    // Si es edición y no cambió la imagen → guardar directo
    if (this.esEdicion && !this.archivoSeleccionado) {
      this.guardarQrDirecto();
      return;
    }

    // Si hay imagen nueva → subir a Cloudinary primero
    const formData = new FormData();
    formData.append('file', this.archivoSeleccionado!);

    this.http.post(`${this.apiUrl}/cloudinary/subir`, formData).subscribe({
      next: (res: any) => {
        this.form.imagenUrl = res.url; // URL segura de TU Cloudinary
        this.guardarQrDirecto();
      },
      error: (err) => {
        console.error('Error subiendo imagen a Cloudinary:', err);
        alert('No se pudo subir la imagen. Intenta otra vez.');
      }
    });
  }

  private guardarQrDirecto() {
    const request = this.esEdicion
      ? this.http.put<QrPago>(`${this.apiUrl}/config/qr/${this.form.id}`, this.form)
      : this.http.post<QrPago>(`${this.apiUrl}/config/qr`, this.form);

    request.subscribe({
      next: () => {
        this.cargarQrs();
        this.cerrarModal();
        alert(this.esEdicion ? 'QR actualizado con éxito : 'QR creado con éxito');
      },
      error: (err) => {
        console.error('Error guardando QR:', err);
        alert('Error al guardar el QR');
      }
    });
  }

  toggleActivo(qr: QrPago) {
    this.http.patch(`${this.apiUrl}/config/qr/${qr.id}/toggle`, {}).subscribe({
      next: () => qr.activo = !qr.activo
    });
  }
}
