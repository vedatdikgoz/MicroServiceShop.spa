import { AddressCreateInput } from "./addressCreateInput";
import { OrderItemCreateInput } from "./orderItemCreateInput";

export class OrderCreateInput {
  buyerId?: string;
  orderItems: OrderItemCreateInput[] = [];
  address: AddressCreateInput = new AddressCreateInput();
}
