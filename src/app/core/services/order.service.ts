import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  
  private apiUrl = `${environment.apiUrl}/Orders`;

  placeOrder(order: Order) {
    return this.http.post(this.apiUrl, order);
  }
}