import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  themeService = inject(ThemeService);
  
  isScrolled = false;
  isMobileMenuOpen = false;
  cartService = inject(CartService);
  totalItems = this.cartService.totalItems;

  private router = inject(Router);
  
  // Listen for scroll events on the window
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  goHome() {
    // Navigate to home page first...
    this.router.navigate(['/']).then(() => {
      // ...then wait a tiny moment for layout shift, and scroll to top.
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }, 50);
    });
  }

  scrollToTop() {
    // Increased to 100ms to allow the Home page to fully load first
    setTimeout(() => {
      window.scrollTo({ 
        top: 0, 
        left: 0, 
        behavior: 'smooth' 
      });
    }, 100); 
  }
}
