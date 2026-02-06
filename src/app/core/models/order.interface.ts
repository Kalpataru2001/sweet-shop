export interface Order {
  id?: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  totalAmount: number;
  orderDate?: string;
}