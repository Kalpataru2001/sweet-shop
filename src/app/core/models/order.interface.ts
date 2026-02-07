import { Sweet } from "./sweet.interface";
export interface OrderItemPayload {
  sweetId: number;
  quantity: number;
  price: number;
  sweet?: Sweet;
}
export interface Order {
  id?: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  totalAmount: number;
  orderDate?: string;
  status?: string;
  orderItems: OrderItemPayload[];
}