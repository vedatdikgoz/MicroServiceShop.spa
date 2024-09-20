export class CheckoutInfoInput{
    country? : string
    province? : string
    district? : string
    addressLine? : string
    zipCode? : string
    cardName?: string
    cardNumber?: string
    expiration?: string
    cvv?: string
    totalPrice?: number
}