import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Sweet } from '../models/sweet.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SweetService {
  private http = inject(HttpClient);
  
  private apiUrl = `${environment.apiUrl}/Sweets`; 

  sweets = signal<Sweet[]>([]);
  loading = signal<boolean>(true);

  constructor() {
    this.refreshSweets();
  }

  // private loadSweets() {
  //   this.loading.set(true);
  //   this.http.get<Sweet[]>(this.apiUrl).subscribe({
  //     next: (data) => {
  //       console.log('✅ API Connected! Data:', data);
  //       this.sweets.set(data);
  //       this.loading.set(false);
  //     },
  //    error: (err) => {
  //       console.error('API Error:', err);
  //       this.loading.set(false); 
  //     }
  //   });
  // }
  public refreshSweets() {
    this.loading.set(true);
    this.http.get<Sweet[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.sweets.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('API Error:', err);
        this.loading.set(false);
      }
    });
  }
  addSweet(sweet: Sweet) {
    return this.http.post<Sweet>(this.apiUrl, sweet);
  }

  // 2. UPDATE Sweet
  updateSweet(id: number, sweet: Sweet) {
    return this.http.put(`${this.apiUrl}/${id}`, sweet);
  }

  // 3. DELETE Sweet
  deleteSweet(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}