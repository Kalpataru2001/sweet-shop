import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { Router } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { SweetService } from '../../core/services/sweet.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  cartService = inject(CartService);
  orderService = inject(OrderService); 
  sweetService = inject(SweetService);
  fb = inject(FormBuilder);
  router = inject(Router);

  orderPlaced = false;
  isSubmitting = false; // New loading state

  checkoutForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    address: ['', [Validators.required, Validators.minLength(10)]]
  });

  onSubmit() {
    if (this.checkoutForm.valid) {

      // 1. Get the current items from the Cart Signal
      const currentItems = this.cartService.getCartItems()();

      // Safety check: Prevent ordering if cart is empty
      if (currentItems.length === 0) {
        alert("Your cart is empty! Please add some sweets.");
        return;
      }

      this.isSubmitting = true; // Start loading spinner

      // 2. Prepare the Order Data (Matches C# Order Model)
      const orderData = {
        customerName: this.checkoutForm.value.fullName!,
        customerPhone: this.checkoutForm.value.phone!,
        customerAddress: this.checkoutForm.value.address!,
        totalAmount: this.cartService.totalPrice(), // Backend recalculates this, but good to send

        // --- VITAL: Map CartItems to the Backend's "OrderItems" format ---
        orderItems: currentItems.map(item => ({
          sweetId: item.sweet.id,   // Must match C# "SweetId"
          quantity: item.quantity,
          price: item.sweet.price   // Price at time of purchase
        }))
        // ----------------------------------------------------------------
      };

      // 3. Send to API
      this.orderService.placeOrder(orderData).subscribe({
        next: (response) => {
          console.log('✅ Order Placed Successfully:', response);

          // A. Stop Spinner & Show Success UI
          this.isSubmitting = false;
          this.orderPlaced = true;

          // B. Clear the cart
          this.cartService.clearCart();

          // C. CRITICAL FIX: Refresh stock data from DB immediately!
          // This ensures the user sees updated stock (e.g., "Sold Out") when they return to the menu.
          this.sweetService.refreshSweets();

          // D. Redirect to Home after 3 seconds
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
        },
        error: (err) => {
          console.error('❌ Order Failed:', err);
          this.isSubmitting = false;

          // Optional: specific error message if stock ran out during transaction
          if (err.error && typeof err.error === 'string' && err.error.includes('stock')) {
            alert("Order Failed: Some items are out of stock. Please check the menu.");
          } else {
            alert('Failed to place order. Please check your connection.');
          }
        }
      });

    } else {
      // If form is invalid, highlight the errors
      this.checkoutForm.markAllAsTouched();
    }
  }
}
