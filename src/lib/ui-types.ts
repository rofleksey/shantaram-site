import type {Product} from "../api/oapi";

export interface CartItem {
  product: Product
  amount: number
}