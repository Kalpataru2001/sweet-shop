import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import gsap from 'gsap';
import { SweetCardComponent } from '../../shared/components/sweet-card/sweet-card.component';
import { RouterLink } from '@angular/router';
import { Sweet } from '../../core/models/sweet.interface';
import { SweetService } from '../../core/services/sweet.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SweetCardComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit{
  @ViewChild('heroText') heroText!: ElementRef;
  @ViewChild('heroImage') heroImage!: ElementRef;

  bestSellers: Sweet[] = [];
  constructor(private sweetService: SweetService) {}
  ngOnInit() {
    // Get only the items marked as 'Best Seller'
    this.bestSellers = this.sweetService.getBestSellers();
  }
  ngAfterViewInit() {
    // Animate Text sliding in from the left
    gsap.from(this.heroText.nativeElement.children, {
      duration: 1,
      y: 50,
      opacity: 0,
      stagger: 0.2, // Time between each line appearing
      ease: 'power3.out',
      delay: 0.5
    });

    // Animate the big sweet image floating on the right
    gsap.from(this.heroImage.nativeElement, {
      duration: 1.5,
      x: 100,
      opacity: 0,
      ease: 'back.out(1.7)',
      delay: 0.2
    });

    // Make the sweet image float continuously
    gsap.to(this.heroImage.nativeElement, {
      y: 20,
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });
  }
}
