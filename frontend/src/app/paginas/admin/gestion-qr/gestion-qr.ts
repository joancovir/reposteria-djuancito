// src/app/paginas/admin/gestion-qr/gestion-qr.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

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
  form: QrPago = { tipo: 'YAPE', imagenUrl: '', telefono: '999675771', nombrePropietario: 'Jessica Chuñe Liza', activo: true };
  imagenPreview = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarQrs();
  }

  cargarQrs() {
    this.http.get<QrPago[]>('http://localhost:8080/api/config/qr/admin').subscribe({
      next: (data) => this.qrs = data
    });
  }

  abrirModal(qr?: QrPago) {
    if (qr) {
      this.esEdicion = true;
      this.form = { ...qr };
      this.imagenPreview = qr.imagenUrl;
    } else {
      this.esEdicion = false;
      this.form = { tipo: 'YAPE', imagenUrl: '', telefono: '999675771', nombrePropietario: 'Jessica Chuñe Liza', activo: true };
      this.imagenPreview = '';
    }
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result as string;
        this.form.imagenUrl = this.imagenPreview;
      };
      reader.readAsDataURL(file);
    }
  }

  guardar() {
    if (!this.form.imagenUrl) {
      alert('Sube una imagen del QR');
      return;
    }

    const request = this.esEdicion
      ? this.http.put(`http://localhost:8080/api/config/qr/${this.form.id}`, this.form)
      : this.http.post('http://localhost:8080/api/config/qr', this.form);

    request.subscribe({
      next: () => {
        this.cargarQrs();
        this.cerrarModal();
        alert(this.esEdicion ? 'QR actualizado' : 'QR creado');
      }
    });
  }

  toggleActivo(qr: QrPago) {
    this.http.patch(`http://localhost:8080/api/config/qr/${qr.id}/toggle`, {}).subscribe({
      next: () => {
        qr.activo = !qr.activo;
      }
    });
  }
}