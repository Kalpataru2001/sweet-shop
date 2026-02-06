import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild, computed, inject } from '@angular/core';
import gsap from 'gsap';
import { SweetCardComponent } from '../../shared/components/sweet-card/sweet-card.component';
import { RouterLink } from '@angular/router';
import { SweetService } from '../../core/services/sweet.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SweetCardComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('heroText') heroText!: ElementRef;
  @ViewChild('heroImage') heroImage!: ElementRef;

  private sweetService = inject(SweetService);

  // FIX: Automatically updates when the API data arrives
  bestSellers = computed(() => 
    this.sweetService.sweets().filter(s => s.tag === 'Best Seller')
  );

  ngAfterViewInit() {
    // Your GSAP Animations (Unchanged)
    gsap.from(this.heroText.nativeElement.children, {
      duration: 1, y: 50, opacity: 0, stagger: 0.2, ease: 'power3.out', delay: 0.5
    });

    gsap.from(this.heroImage.nativeElement, {
      duration: 1.5, x: 100, opacity: 0, ease: 'back.out(1.7)', delay: 0.2
    });

    gsap.to(this.heroImage.nativeElement, {
      y: 20, duration: 2, yoyo: true, repeat: -1, ease: 'sine.inOut'
    });
  }
}