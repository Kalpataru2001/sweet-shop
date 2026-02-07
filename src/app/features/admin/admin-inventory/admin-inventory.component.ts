import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SweetService } from '../../../core/services/sweet.service';
import { Sweet } from '../../../core/models/sweet.interface';
import { RupeeFormatPipe } from '../../../shared/pipes/rupee-format.pipe';

@Component({
  selector: 'app-admin-inventory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RupeeFormatPipe],
  templateUrl: './admin-inventory.component.html',
  styles: []
})
export class AdminInventoryComponent {
  sweetService = inject(SweetService);
  fb = inject(FormBuilder);

  sweets = this.sweetService.sweets;
  showModal = signal(false);
  isEditing = signal(false);
  currentId = signal<number | null>(null);

  // Form Definition
  sweetForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(1)]],
    stockQuantity: [100, [Validators.required, Validators.min(0)]],
    category: ['Milk Sweets', Validators.required],
    imageUrl: ['', Validators.required],
    unit: ['piece', Validators.required],
    tag: [''],
    weightPerPiece: [null as number | null]
  });

  categories = ['Pure Ghee', 'Milk Sweets', 'Dry Fruits', 'Bengali Specials', 'Snacks'];

  constructor() {
    this.sweetService.refreshSweets();
  }

  openAddModal() {
    this.isEditing.set(false);
    this.currentId.set(null);
    this.sweetForm.reset({ stockQuantity: 100, category: 'Milk Sweets', unit: 'piece', weightPerPiece: null });
    this.showModal.set(true);
  }

  openEditModal(sweet: Sweet) {
    this.isEditing.set(true);
    this.currentId.set(sweet.id);
    this.sweetForm.patchValue({
      name: sweet.name,
      description: sweet.description,
      price: sweet.price,
      stockQuantity: sweet.stockQuantity,
      category: sweet.category,
      imageUrl: sweet.imageUrl,
      unit: sweet.unit,
      tag: sweet.tag,
      weightPerPiece: sweet.weightPerPiece
    });
    this.showModal.set(true);
  }

  deleteSweet(id: number) {
    if (confirm('Are you sure?')) {
      this.sweetService.deleteSweet(id).subscribe(() => this.sweetService.refreshSweets());
    }
  }

  onSubmit() {
    if (this.sweetForm.invalid) return;
    const formValue = this.sweetForm.value;

    // Logic: If 'Kg', we need weightPerPiece. If 'Piece', we ignore it.
    const isKg = formValue.unit === 'kg';

    const sweetPayload: Sweet = {
      id: this.currentId() || 0,
      name: formValue.name!,
      description: formValue.description!,
      price: formValue.price!,
      stockQuantity: formValue.stockQuantity!,
      category: formValue.category!,
      imageUrl: formValue.imageUrl!,
      unit: formValue.unit!,
      tag: formValue.tag || undefined,
      weightPerPiece: (isKg && formValue.weightPerPiece) ? formValue.weightPerPiece : undefined
    };

    if (this.isEditing()) {
      this.sweetService.updateSweet(this.currentId()!, sweetPayload).subscribe(() => {
        this.closeModal();
        this.sweetService.refreshSweets();
      });
    } else {
      this.sweetService.addSweet(sweetPayload).subscribe(() => {
        this.closeModal();
        this.sweetService.refreshSweets();
      });
    }
  }

  closeModal() {
    this.showModal.set(false);
  }
}