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
  public totalItems = computed(() => this.cartItems().length);
 
  // 2. Computed values (automatically update when cartItems changes)
  // Counts total number of items
  
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

  addToCart(sweet: Sweet, quantityToAdd: number = 1) { 
    this.cartItems.update(items => {
      const existingItem = items.find(item => item.sweet.id === sweet.id);

      if (existingItem) {
        // Check Stock (Decimal aware)
        const newQuantity = Number(existingItem.quantity) + Number(quantityToAdd);

        if (newQuantity > sweet.stockQuantity) {
          alert(`Sorry, only ${sweet.stockQuantity} ${sweet.unit} available!`);
          return items;
        }

        return items.map(item =>
          item.sweet.id === sweet.id
            ? { ...item, quantity: newQuantity } // Use the calculated number
            : item
        );
      } else {
        if (sweet.stockQuantity < quantityToAdd) {
          alert(`Not enough stock!`);
          return items;
        }
        return [...items, { sweet, quantity: Number(quantityToAdd) }];
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