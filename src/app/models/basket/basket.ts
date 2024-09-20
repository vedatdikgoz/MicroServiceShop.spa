import { BasketItem } from "./basketItem";

export class Basket {
  userId!: string
  discountCode?: string 
  discountRate?: number 
  totalPrice!: number
  basketItems: BasketItem[] = [];

}