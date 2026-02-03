import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Sweet } from '../../../core/models/sweet.interface';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-sweet-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sweet-card.component.html',
  styleUrl: './sweet-card.component.scss'
})
export class SweetCardComponent {
@Input() sweet!: Sweet;
constructor(private cartService: CartService) {}

// Triggered when button is clicked
  onAddToCart(event: Event) {
    event.stopPropagation(); // Prevents page from jumping if inside a link
    this.cartService.addToCart(this.sweet);
    console.log(`${this.sweet.name} added to cart!`); // Just for testing
  }
}
