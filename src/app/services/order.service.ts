import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Address } from '../models/order/address';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClient: HttpClient) { }

  private baseUrl = `${environment.gatewayBaseUri}/${environment.orderPath}`;

  addAddress(address: Address): Observable<Address> {
    return this.httpClient.post<Address>(`${this.baseUrl}Addresses`, address)
  }
}
