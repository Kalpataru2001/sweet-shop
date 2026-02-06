import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-96 border border-gray-200 dark:border-gray-700">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">🔐 Admin Access</h2>
        
        <input 
          type="password" 
          [(ngModel)]="password"
          placeholder="Enter Admin PIN" 
          class="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mb-4 focus:ring-2 focus:ring-orange-500 outline-none"
        >

        <button 
          (click)="login()"
          class="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors">
          Unlock Dashboard
        </button>

        <p *ngIf="error()" class="text-red-500 text-sm mt-4 text-center">❌ Incorrect PIN</p>
      </div>
    </div>
  `
})
export class AdminLoginComponent {
router = inject(Router);
  password = '';
  error = signal(false);

  login() {
    // 🔐 SIMPLE SECURITY: Hardcoded PIN (Change this to whatever you want)
    if (this.password === 'admin123') {
      localStorage.setItem('admin_token', 'logged_in'); // Save "key" to browser
      this.router.navigate(['/admin']); // Go to dashboard
    } else {
      this.error.set(true);
    }
  }
}
