import { CommonModule } from '@angular/common';
import { Component, computed, signal, inject } from '@angular/core';
import { SweetCardComponent } from '../../shared/components/sweet-card/sweet-card.component';
import { SweetService } from '../../core/services/sweet.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, SweetCardComponent, FormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  public sweetService = inject(SweetService);

  searchQuery = signal<string>('');
  selectedCategory = signal<string>('All');
  categories = ['All', 'Pure Ghee', 'Milk Sweets', 'Dry Fruits', 'Bengali Specials'];

  // FIX: Connects directly to sweetService.sweets()
  filteredSweets = computed(() => {
    // 1. Get real data from API
    let filtered = this.sweetService.sweets();

    // 2. Filter by Category
    if (this.selectedCategory() !== 'All') {
      filtered = filtered.filter(s => s.category === this.selectedCategory());
    }

    // 3. Filter by Search Query
    const query = this.searchQuery().trim().toLowerCase();
    if (query !== '') {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(query) || 
        (s.description && s.description.toLowerCase().includes(query))
      );
    }

    return filtered;
  });

  setCategory(cat: string) {
    this.selectedCategory.set(cat);
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }
}