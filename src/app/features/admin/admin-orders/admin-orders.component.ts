import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, DatePipe,RouterLink],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.scss'
})
export class AdminOrdersComponent {
orderService = inject(OrderService);

  // 1. Raw Data (All Orders)
  orders = signal<Order[]>([]);
  loading = signal<boolean>(true);
  selectedOrder: Order | null = null;

  // 2. Pagination State
  currentPage = signal(1);
  itemsPerPage = 5;

  paginatedOrders = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage;
    return this.orders().slice(startIndex, startIndex + this.itemsPerPage);
  });
  totalPages = computed(() => Math.ceil(this.orders().length / this.itemsPerPage));

  constructor() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading.set(true); // Start loading
    
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.loading.set(false); // Stop loading when done
        this.currentPage.set(1);
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.loading.set(false); // Stop loading even if it fails
      }
    });
  }
  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }
  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }
  viewOrderDetails(order: Order) {
    this.selectedOrder = order;
  }

  // NEW: Closes the modal
  closeModal() {
    this.selectedOrder = null;
  }
  updateStatus(orderId: number, newStatus: string) {
    if (!confirm(`Are you sure you want to mark Order #${orderId} as ${newStatus}?`)) return;

    // Optimistic Update (Update UI immediately)
    this.orders.update(currentOrders =>
      currentOrders.map(o =>
        o.id === orderId ? { ...o, status: newStatus } : o
      )
    );

    // Call API (We will add this method to OrderService next)
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      error: (err) => {
        alert('Failed to update status');
        console.error(err);
        // Revert change if API fails (Optional, but good practice)
        this.loadOrders();
      }
    });
  }
}
