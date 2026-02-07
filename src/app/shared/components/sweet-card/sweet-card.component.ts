import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, signal } from '@angular/core';
import { Sweet } from '../../../core/models/sweet.interface';
import { CartService } from '../../../core/services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sweet-card',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './sweet-card.component.html',
  styleUrl: './sweet-card.component.scss'
})
export class SweetCardComponent {
  @Input() sweet!: Sweet;

  // ✅ FIX: Use 'inject' here and remove it from the constructor
  cartService = inject(CartService);
  buyMode = signal<'kg' | 'piece'>('piece');

  // Inputs
  selectedWeight = signal<number>(1); // For Kg Mode (e.g. 0.25)
  pieceCount = signal<number>(1);     // For Piece Mode (e.g. 5)

  ngOnChanges() {
    // If it's a Kg item, default to Kg mode
    if (this.sweet.unit === 'kg') {
      this.buyMode.set('kg');
    } else {
      this.buyMode.set('piece');
    }
  }

  priceDisplay = computed(() => {
    if (this.buyMode() === 'piece' && this.sweet.unit === 'kg' && this.sweet.weightPerPiece) {
      const pricePerPiece = this.sweet.price * this.sweet.weightPerPiece;
      return `₹${Math.round(pricePerPiece)} / pc`;
    }
    // Case 2: Standard Display
    return `₹${this.sweet.price} / ${this.sweet.unit}`;
  });

  weightOptions = [
    { label: '250g', value: 0.25 },
    { label: '500g', value: 0.5 },
    { label: '1 Kg', value: 1 }
  ];
  toggleMode(mode: 'kg' | 'piece') {
    this.buyMode.set(mode);
  }
  updatePieceCount(change: number) {
    const newVal = this.pieceCount() + change;
    if (newVal >= 1) this.pieceCount.set(newVal);
  }
  constructor() { } // ✅ FIX: Empty constructor (no arguments)

  onAddToCart(event: Event) {
    event.stopPropagation();

    let finalQuantity = 0;

    // SCENARIO 1: Simple Piece Item (Mixture)
    if (this.sweet.unit === 'piece') {
      finalQuantity = this.pieceCount();
    }
    // SCENARIO 2: Dual Item (Rasgulla)
    else {
      if (this.buyMode() === 'kg') {
        finalQuantity = this.selectedWeight();
      } else {
        // Convert Pieces to Kg
        finalQuantity = this.pieceCount() * (this.sweet.weightPerPiece || 0);
      }
    }

    this.cartService.addToCart(this.sweet, finalQuantity);
  }
}
