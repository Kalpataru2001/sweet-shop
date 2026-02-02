import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SweetCardComponent } from '../../shared/components/sweet-card/sweet-card.component';
import { Sweet } from '../../core/models/sweet.interface';
import { SweetService } from '../../core/services/sweet.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, SweetCardComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
sweets: Sweet[] = [];

  // Inject the service
  constructor(private sweetService: SweetService) {}

  ngOnInit() {
    // Fetch data when component loads
    this.sweets = this.sweetService.getSweets();
  }
}
