import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Sweet } from '../../../core/models/sweet.interface';

@Component({
  selector: 'app-sweet-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sweet-card.component.html',
  styleUrl: './sweet-card.component.scss'
})
export class SweetCardComponent {
@Input() sweet!: Sweet;
}
