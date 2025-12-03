import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast show align-items-center text-bg-success border-0 fade" 
         role="alert" 
         [style.display]="visible ? 'flex' : 'none'">
      <div class="d-flex">
        <div class="toast-body">
          <i class="bi bi-check-circle-fill me-2"></i>
          {{ mensaje }}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" 
                (click)="cerrar()"></button>
      </div>
    </div>
  `,
  styles: [`
    .toast {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1055;
      min-width: 300px;
      animation: slideIn 0.3s ease-out;
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  @Input() mensaje = '';
  visible = true;

  cerrar() {
    this.visible = false;
  }

  ocultar() {
    setTimeout(() => this.visible = false, 3000);
  }
}