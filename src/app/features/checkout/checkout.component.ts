import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { Router } from '@angular/router';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  cartService = inject(CartService);
  orderService = inject(OrderService); // Inject it
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

      // 2. Prepare the Order Data (Exact match for C# Order Model)
      const orderData = {
        customerName: this.checkoutForm.value.fullName!,
        customerPhone: this.checkoutForm.value.phone!,
        customerAddress: this.checkoutForm.value.address!,
        totalAmount: this.cartService.totalPrice(),
        
        // --- VITAL FIX: Map CartItems to the Backend's "OrderItems" format ---
        orderItems: currentItems.map(item => ({
          sweetId: item.sweet.id,   // Must match C# "SweetId"
          quantity: item.quantity,
          price: item.sweet.price   // Price at time of purchase
        }))
        // ---------------------------------------------------------------------
      };

      // 3. Send to API
      this.orderService.placeOrder(orderData).subscribe({
        next: (response) => {
          console.log('✅ Order Placed Successfully:', response);
          this.isSubmitting = false;
          this.orderPlaced = true; // Shows the Success UI
          
          this.cartService.clearCart(); // Clear the cart now that order is saved

          // Redirect to Home after 3 seconds
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
        },
        error: (err) => {
          console.error('❌ Order Failed:', err);
          this.isSubmitting = false;
          alert('Failed to place order. Please check your connection.');
        }
      });

    } else {
      // If form is invalid, highlight the errors
      this.checkoutForm.markAllAsTouched();
    }
  }
}
