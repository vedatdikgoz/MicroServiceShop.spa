
export class BasketItem {
    quantity!: number
    productId?: string
    productName?: string
    price!: number

    _discountAppliedPrice: number | null = null;
   

  get getCurrentPrice(): number {
    return this._discountAppliedPrice !== null ? this._discountAppliedPrice : this.price;
  }
}