import { BasketItem } from "./basketItem";

export class Basket {
  userId!: string
  discountCode?: string | null
  discountRate?: number | null

  basketItems: BasketItem[] = [];

  get getTotalPrice(): number {
    return this.basketItems.reduce((sum, item) => sum + item.getCurrentPrice, 0);
  }
}