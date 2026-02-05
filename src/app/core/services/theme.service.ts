import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Signal to hold the current theme state. Defaults to 'light'
  isDarkMode = signal<boolean>(false);

  constructor() {
    // 1. Check if user already has a saved preference in their browser
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode.set(true);
    }

    // 2. Effect: This runs automatically whenever isDarkMode signal changes!
    effect(() => {
      if (this.isDarkMode()) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // Method to flip the switch
  toggleTheme() {
    this.isDarkMode.update(current => !current);
  }
}