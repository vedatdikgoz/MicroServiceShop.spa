import { BasketItem } from "./basketItem";

export class Basket {
  userId!: string
  discountCode?: string | null
  discountRate?: number | null

  constructor(userId: string, basketItems: BasketItem[] = []) {
    this.userId = userId;
    this.basketItems = basketItems;
  }

  basketItems!: BasketItem[];

  get getTotalPrice(): number {
    return this.basketItems.reduce((sum, item) => sum + item.getCurrentPrice, 0);
  }
}