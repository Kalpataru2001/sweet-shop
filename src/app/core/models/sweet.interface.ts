export interface Sweet {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  tag?: string; // e.g., "Best Seller" or "Pure Ghee"
  category: string; // e.g., "Milk Sweets", "Dry Fruits", etc.
  stockQuantity: number;
  unit: string; 
  weightPerPiece?: number;
}