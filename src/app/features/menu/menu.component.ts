import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { SweetCardComponent } from '../../shared/components/sweet-card/sweet-card.component';
import { Sweet } from '../../core/models/sweet.interface';
import { SweetService } from '../../core/services/sweet.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, SweetCardComponent,FormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  allSweets = signal<Sweet[]>([]);

  // State for search and filter
  searchQuery = signal<string>('');
  selectedCategory = signal<string>('All');
  categories = ['All', 'Pure Ghee', 'Milk Sweets', 'Dry Fruits'];

  // Computed signal that automatically filters the list when search or category changes
  filteredSweets = computed(() => {
    let filtered = this.allSweets();

    // 1. Filter by Category
    if (this.selectedCategory() !== 'All') {
      filtered = filtered.filter(s => s.category === this.selectedCategory());
    }

    // 2. Filter by Search Query
    if (this.searchQuery().trim() !== '') {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(query) || 
        s.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  });

  constructor(private sweetService: SweetService) {}

  ngOnInit() {
    this.allSweets.set(this.sweetService.getSweets());
  }

  // Helper method to update category
  setCategory(cat: string) {
    this.selectedCategory.set(cat);
  }

  // Helper method to update search
  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }
}
