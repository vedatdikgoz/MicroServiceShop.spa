import { OrderCreateInput } from "../order/orderCreateInput"

export class PaymentInfoInput {
    cardName?: string
    cardNumber?: string
    expiration?: string
    cvv?: string
    totalPrice?: number
    order?:OrderCreateInput 
}