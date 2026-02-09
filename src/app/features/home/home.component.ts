import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, QueryList, ViewChild, ViewChildren, computed, inject } from '@angular/core';
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
  @ViewChild('bgBlob1') bgBlob1!: ElementRef; // New Ref for background
  @ViewChild('bgBlob2') bgBlob2!: ElementRef; // New Ref for background

  @ViewChildren('animatedSection') animatedSections!: QueryList<ElementRef>;

  private sweetService = inject(SweetService);

  // FIX: Automatically updates when the API data arrives
  bestSellers = computed(() => 
    this.sweetService.sweets().filter(s => s.tag === 'Best Seller').slice(0, 3) // Take top 3
  );

  ngAfterViewInit() {
    this.initHeroAnimations();
    this.initScrollAnimations();
    this.initParallax();
  }

  private initHeroAnimations() {
    const tl = gsap.timeline();

    // Text Reveal (Staggered)
    tl.from(this.heroText.nativeElement.children, {
      duration: 1, 
      y: 50, 
      opacity: 0, 
      stagger: 0.15, 
      ease: 'power3.out'
    });

    // Image Pop-in
    tl.from(this.heroImage.nativeElement, {
      duration: 1.2, 
      scale: 0.8, 
      opacity: 0, 
      rotation: -10,
      ease: 'elastic.out(1, 0.5)'
    }, "-=0.8");

    // Continuous Floating Motion for Image
    gsap.to(this.heroImage.nativeElement, {
      y: 20, 
      rotation: 2,
      duration: 3, 
      yoyo: true, 
      repeat: -1, 
      ease: 'sine.inOut'
    });
  }

  private initScrollAnimations() {
    this.animatedSections.forEach((section) => {
      gsap.fromTo(section.nativeElement, 
        { opacity: 0, y: 50 },
        {
          opacity: 1, 
          y: 0, 
          duration: 1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section.nativeElement,
            start: 'top 80%', // Start animation when top of section hits 80% of viewport
            toggleActions: 'play none none reverse' // Play on enter, reverse on leave
          }
        }
      );
    });
  }

  // 3. Parallax Effect for Background Blobs (FIXED)
  private initParallax() {
    // We find the parent section of the text to use as the trigger
    const heroSection = this.heroText.nativeElement.closest('section');

    // Blob 1 (Top Right) - Moves DOWN faster than scroll
    gsap.to(this.bgBlob1.nativeElement, {
      y: 200, // Move down 200px
      rotation: 45, // Slight rotation for flair
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top', // Start when section top hits viewport top
        end: 'bottom top', // End when section bottom hits viewport top
        scrub: true // Smoothly link animation to scrollbar
      }
    });

    // Blob 2 (Bottom Left) - Moves UP against the scroll (Classic Parallax)
    gsap.to(this.bgBlob2.nativeElement, {
      y: -150, // Move UP 150px
      rotation: -45,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }
}