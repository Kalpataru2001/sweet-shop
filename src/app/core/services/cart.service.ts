import { Injectable, signal, computed } from '@angular/core';
import { Sweet } from '../models/sweet.interface';
import { CartItem } from '../models/cart-item.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  // 1. The State: A Signal holding an array of CartItems
  private cartItems = signal<CartItem[]>([]);
  public isCartOpen = signal<boolean>(false);
  // 2. Computed values (automatically update when cartItems changes)
  // Counts total number of items
  public totalItems = computed(() => 
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );

  // Calculates total price
  public totalPrice = computed(() => 
    this.cartItems().reduce((acc, item) => acc + (item.sweet.price * item.quantity), 0)
  );

  constructor() { }

  // Expose the cart items as a readonly signal
  getCartItems() {
    return this.cartItems.asReadonly();
  }
  toggleCart() {
    this.isCartOpen.update(val => !val);
  }

  // Method to add items to cart
  addToCart(sweet: Sweet) {
    this.cartItems.update(items => {
      // Check if item already exists in cart
      const existingItem = items.find(item => item.sweet.id === sweet.id);

      if (existingItem) {
        // If it exists, increase the quantity
        return items.map(item => 
          item.sweet.id === sweet.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // If it's new, add it to the array with quantity 1
        return [...items, { sweet, quantity: 1 }];
      }
    });
    
  }

  removeFromCart(sweetId: number) {
    this.cartItems.update(items => {
      const existingItem = items.find(item => item.sweet.id === sweetId);
      
      if (existingItem && existingItem.quantity > 1) {
        // Reduce quantity if more than 1
        return items.map(item => 
          item.sweet.id === sweetId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        // Remove completely if quantity is 1
        return items.filter(item => item.sweet.id !== sweetId);
      }
    });
  }
  clearCart() {
    this.cartItems.set([]); 
  }
}