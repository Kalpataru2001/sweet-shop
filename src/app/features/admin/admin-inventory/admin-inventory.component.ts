import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SweetService } from '../../../core/services/sweet.service';
import { Sweet } from '../../../core/models/sweet.interface';
import { RupeeFormatPipe } from '../../../shared/pipes/rupee-format.pipe';
import { ImageUploadService } from '../../../core/services/image-upload.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-inventory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RupeeFormatPipe],
  templateUrl: './admin-inventory.component.html',
  styles: []
})
export class AdminInventoryComponent {
  authService = inject(AuthService);
  imageService = inject(ImageUploadService);
  sweetService = inject(SweetService);
  fb = inject(FormBuilder);

  selectedFile: File | null = null;
  imagePreview = signal<string | null>(null);
  sweets = this.sweetService.sweets;
  showModal = signal(false);
  isEditing = signal(false);
  isUploading = signal(false);
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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    // Create a local preview URL so the user can see the image immediately
    const objectUrl = URL.createObjectURL(file);
    this.imagePreview.set(objectUrl);

    // Mark the form field as "touched" so validation knows we have an image (optional logic)
    this.sweetForm.patchValue({ imageUrl: 'pending-upload' });
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
    this.imagePreview.set(sweet.imageUrl);
    this.selectedFile = null;
    this.showModal.set(true);
  }

  deleteSweet(id: number) {
    if (confirm('Are you sure?')) {
      this.sweetService.deleteSweet(id).subscribe(() => this.sweetService.refreshSweets());
    }
  }

  async onSubmit() {
    // 1. Validation Check
    if (this.sweetForm.invalid) {
      console.log('❌ FORM IS INVALID!');
      Object.keys(this.sweetForm.controls).forEach(key => {
        const controlErrors = this.sweetForm.get(key)?.errors;
        if (controlErrors != null) {
          console.error(`🔴 Invalid Field: ${key}`, controlErrors);
          alert(`Please fix the ${key} field.`);
        }
      });
      return;
    }

    // 2. Start Loading
    this.isUploading.set(true);

    try {
      let finalImageUrl = this.sweetForm.value.imageUrl;

      // 🚀 THE FIX: Only upload if a NEW file was selected
      if (this.selectedFile) {
        // Upload to Supabase and get the new Public URL
        finalImageUrl = await this.imageService.uploadImage(this.selectedFile);
      }

      // 3. Prepare Data
      const formValue = this.sweetForm.value;
      const isKg = formValue.unit === 'kg';

      const sweetPayload: Sweet = {
        id: this.currentId() || 0,
        name: formValue.name!,
        description: formValue.description!,
        price: formValue.price!,
        stockQuantity: formValue.stockQuantity!,
        category: formValue.category!,
        imageUrl: finalImageUrl!, // Use the NEW URL (or the old one if unchanged)
        unit: formValue.unit!,
        tag: formValue.tag || undefined,
        weightPerPiece: (isKg && formValue.weightPerPiece) ? formValue.weightPerPiece : undefined
      };

      // 4. Save to Database
      if (this.isEditing()) {
        this.sweetService.updateSweet(this.currentId()!, sweetPayload).subscribe({
          next: () => {
            this.closeModal();
            this.sweetService.refreshSweets();
          },
          error: (err) => {
            console.error(err);
            alert('Failed to update product');
          }
        });
      } else {
        this.sweetService.addSweet(sweetPayload).subscribe({
          next: () => {
            this.closeModal();
            this.sweetService.refreshSweets();
          },
          error: (err) => {
            console.error(err);
            alert('Failed to create product');
          }
        });
      }

    } catch (error) {
      console.error('Upload or Save Failed:', error);
      alert('Something went wrong! Check the console.');
    } finally {
      // 5. Stop Loading (always runs)
      this.isUploading.set(false);
    }
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedFile = null;
    this.imagePreview.set(null);
  }
  logout() {
  this.authService.logout();
}
}