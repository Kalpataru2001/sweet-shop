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
      this.isSubmitting = true; // Start loading

      // 1. Prepare the Order Data
      const orderData = {
        customerName: this.checkoutForm.value.fullName!,
        customerPhone: this.checkoutForm.value.phone!,
        customerAddress: this.checkoutForm.value.address!,
        totalAmount: this.cartService.totalPrice()
      };

      // 2. Send to API
      this.orderService.placeOrder(orderData).subscribe({
        next: (response) => {
          console.log('Order Success:', response);
          this.isSubmitting = false;
          this.orderPlaced = true;
          this.cartService.clearCart(); // Clear the cart on success

          // Redirect after 3 seconds
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
        },
        error: (err) => {
          console.error('Order Failed:', err);
          this.isSubmitting = false;
          alert('Failed to place order. Please try again.');
        }
      });
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }
}
