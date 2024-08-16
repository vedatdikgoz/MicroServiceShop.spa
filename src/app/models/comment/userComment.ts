import { DatePipe } from "@angular/common"

export class UserComment{
    id!:string
    nameSurname!:string
    email?:string
    imageUrl?:string
    commentDetail?:string
    rating?: number
    createdDate!: Date
    productId!:string 
}