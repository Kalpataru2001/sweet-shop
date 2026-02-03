import { Component, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import AOS from 'aos';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { CartDrawerComponent } from './shared/components/cart-drawer/cart-drawer.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterOutlet,LoaderComponent,CartDrawerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  isLoading = false;
  title = 'sweet-shop';

  constructor(private router: Router) {
    // Subscribe to router events to toggle loader
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      }
      
      if (
        event instanceof NavigationEnd || 
        event instanceof NavigationCancel || 
        event instanceof NavigationError
      ) {
        // Add a small delay so the animation is visible (optional aesthetic choice)
        setTimeout(() => {
          this.isLoading = false;
        }, 800); 
      }
    });
  }
  
  ngOnInit() {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100
    });
  }
}
