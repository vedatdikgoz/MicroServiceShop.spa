import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Address } from '../models/order/address';
import { map, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClient: HttpClient) { }

  private baseUrl = `${environment.gatewayBaseUri}/${environment.orderPath}`;

  addAddress(address: Address): Observable<Address> {
    return this.httpClient.post<Address>(`${this.baseUrl}Addresses`, address)
  }

  getOrders(userId: string): Observable<Order[]> {
    return this.httpClient.get<{ data: Order[] }>(`${this.baseUrl}Orders/user=${userId}`)
      .pipe(map(response => response.data))
  }
}
