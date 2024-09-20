import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { PaymentInfoInput } from '../models/payment/paymentInfoInput';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private httpClient: HttpClient) { }


  private baseUrl = `${environment.gatewayBaseUri}/${environment.paymentPath}`;

  receivePayment(paymentInfoInput: PaymentInfoInput): Observable<PaymentInfoInput> {
    return this.httpClient.post<PaymentInfoInput>(`${this.baseUrl}Payments`, paymentInfoInput)
  }
}
