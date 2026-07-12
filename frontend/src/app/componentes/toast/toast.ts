import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-card" role="alert" [style.display]="visible ? 'flex' : 'none'">
      <div class="toast-icon" aria-hidden="true">
        <i class="bi bi-check-circle-fill"></i>
      </div>
      <div class="toast-content">
        <strong>¡Listo!</strong>
        <div>{{ mensaje }}</div>
      </div>
      <button type="button" class="toast-close" (click)="cerrar()" aria-label="Cerrar notificación">
        <i class="bi bi-x-lg"></i>
      </button>
      <div class="toast-progress"></div>
    </div>
  `,
  styles: [`
    .toast-card {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1055;
      min-width: 300px;
      max-width: 360px;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 14px 14px 12px;
      border-radius: 16px;
      background: linear-gradient(135deg, #fff7ef 0%, #fffdfb 100%);
      color: #2f2f2f;
      box-shadow: 0 16px 30px rgba(0, 0, 0, 0.16);
      border: 1px solid rgba(253, 126, 20, 0.18);
      animation: slideIn 0.25s ease-out;
      overflow: hidden;
    }

    .toast-icon {
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: rgba(253, 126, 20, 0.16);
      color: #eb7221;
      font-size: 20px;
      flex-shrink: 0;
    }

    .toast-content {
      flex: 1;
      font-size: 0.95rem;
    }

    .toast-close {
      border: none;
      background: transparent;
      color: #6b6b6b;
      cursor: pointer;
      padding: 2px;
    }

    .toast-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      width: 100%;
      background: linear-gradient(90deg, #fd7e14 0%, #eb7221 100%);
      animation: progressBar 3s linear forwards;
    }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    @keyframes progressBar {
      from { width: 100%; }
      to { width: 0%; }
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  @Input() mensaje = '';
  visible = true;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.ocultar();
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  cerrar() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.visible = false;
  }

  ocultar() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => this.visible = false, 3000);
  }
}