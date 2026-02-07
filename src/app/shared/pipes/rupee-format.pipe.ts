import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rupeeFormat',
  standalone: true
})
export class RupeeFormatPipe implements PipeTransform {

  transform(value: number): string {
    if (isNaN(value)) return '₹0.00';

    // Formats as Indian Currency (e.g., ₹1,200.00)
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }
}