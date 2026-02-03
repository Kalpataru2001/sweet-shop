import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './cart-drawer.component.html',
  styleUrl: './cart-drawer.component.scss'
})
export class CartDrawerComponent {
  cartService = inject(CartService);
  isCartOpen = this.cartService.isCartOpen;
  cartItems = this.cartService.getCartItems();
  totalPrice = this.cartService.totalPrice;

  closeCart() {
    this.cartService.isCartOpen.set(false);
  }
}
