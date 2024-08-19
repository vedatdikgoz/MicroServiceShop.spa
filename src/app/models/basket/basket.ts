import { BasketItem } from "./basketItem";

export class Basket {
  userId!: string
  discountCode?: string | null
  discountRate?: number | null
  totalPrice!: number
  basketItems: BasketItem[] = [];



  get appliedDiscountTotalPrice(): number {
    // Eğer discountRate undefined veya null ise, 0 olarak kabul et
    const rate = this.discountRate ?? 0;
    return this.totalPrice - (this.totalPrice * (rate / 100));
  }
}