import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  message = signal<string>('');
  isVisible = signal<boolean>(false);

  show(msg: string) {
    this.message.set(msg);
    this.isVisible.set(true);
    // Hide after 3 seconds
    setTimeout(() => this.isVisible.set(false), 3000);
  }
}