import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order/order';
import { CheckoutInfoInput } from '../models/order/checkoutInfoInput';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClient: HttpClient) { }

  private baseUrl = `${environment.gatewayBaseUri}/${environment.orderPath}`;


  getOrders(userId: string): Observable<Order[]> {
    return this.httpClient.get<{ data: Order[] }>(`${this.baseUrl}Orders/user=${userId}`)
      .pipe(map(response => response.data))
  }


  createOrder(checkoutInfoInput: CheckoutInfoInput): Observable<CheckoutInfoInput> {
    return this.httpClient.post<CheckoutInfoInput>(`${this.baseUrl}Orders`, checkoutInfoInput)
  }
}
