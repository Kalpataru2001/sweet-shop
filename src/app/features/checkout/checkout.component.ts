import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  public cartService = inject(CartService);
  private router = inject(Router);

  orderPlaced = false;

  // Define the Form with Validation rules
  checkoutForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    address: ['', Validators.required],
    paymentMethod: ['cod', Validators.required] // Default to Cash on Delivery
  });

  onSubmit() {
    if (this.checkoutForm.valid && this.cartService.totalItems() > 0) {
      // Simulate API call
      console.log('Order Data:', this.checkoutForm.value);
      console.log('Items Ordered:', this.cartService.getCartItems()());

      // Show Success UI
      this.orderPlaced = true;

      // Clear the cart
      // (We need to add a clearCart() method in CartService, or just do this for now)
      setTimeout(() => {
        this.router.navigate(['/']); // Redirect to home after 4 seconds
      }, 4000);
    } else {
      // Touch all fields to show error messages
      this.checkoutForm.markAllAsTouched();
    }
  }
}
