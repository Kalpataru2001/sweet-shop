import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.interface';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.scss'
})
export class AdminOrdersComponent {
orderService = inject(OrderService);
  orders = signal<Order[]>([]);
  loading = signal<boolean>(true);

  selectedOrder: Order | null = null;

  constructor() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading.set(true); // Start loading
    
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.loading.set(false); // Stop loading when done
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.loading.set(false); // Stop loading even if it fails
      }
    });
  }
  viewOrderDetails(order: Order) {
    this.selectedOrder = order;
  }

  // NEW: Closes the modal
  closeModal() {
    this.selectedOrder = null;
  }
}
