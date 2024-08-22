import { OrderItem } from "./orderItem"

export class Order{
id!:number
userId!: string 
totalPrice?:number
orderDate?:Date
orderItems:OrderItem[] = [] 
}