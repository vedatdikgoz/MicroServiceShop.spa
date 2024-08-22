import { BasketItem } from "./basketItem";

export class Basket {
  userId!: string
  discountCode?: string | null
  discountRate?: number | null
  totalPrice!: number
  basketItems: BasketItem[] = [];

}