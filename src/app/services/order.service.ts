import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CheckoutInfoInput } from '../models/order/checkoutInfoInput';
import { OrderCreateInput } from '../models/order/orderCreateInput';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClient: HttpClient) { }

  private baseUrl = `${environment.gatewayBaseUri}/${environment.orderPath}`;


  getOrders(): Observable<OrderCreateInput[]> {
    return this.httpClient.get<{ data: OrderCreateInput[] }>(`${this.baseUrl}Orders`)
      .pipe(map(response => response.data))
  }


  createOrder(checkoutInfoInput: CheckoutInfoInput): Observable<CheckoutInfoInput> {
    return this.httpClient.post<CheckoutInfoInput>(`${this.baseUrl}Orders`, checkoutInfoInput)
  }
}
