import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="toastService.isVisible()" 
         class="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-xl z-50 flex items-center animate-bounce-in">
      ✅ {{ toastService.message() }}
    </div>
  `,
  styles: [`
    .animate-bounce-in { animation: popIn 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55); }
    @keyframes popIn { 
      0% { transform: translate(-50%, 100%) scale(0.5); opacity: 0; } 
      100% { transform: translate(-50%, 0) scale(1); opacity: 1; } 
    }
  `]
})
export class ToastComponent {
toastService = inject(ToastService);
}
