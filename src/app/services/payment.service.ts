import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, tap } from 'rxjs';
import { PaymentInfoInput } from '../models/payment/paymentInfoInput';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private httpClient: HttpClient) { }


  private baseUrl = `${environment.gatewayBaseUri}/${environment.paymentPath}`;

  // receivePayment(paymentInfoInput: PaymentInfoInput): Observable<PaymentInfoInput> {
  //   return this.httpClient.post<PaymentInfoInput>(`${this.baseUrl}Payments`, paymentInfoInput)
  // }

  receivePayment(paymentInfoInput: PaymentInfoInput): Observable<PaymentInfoInput> {
    console.log('Giden İstek:', paymentInfoInput);
  
    return this.httpClient.post<PaymentInfoInput>(`${this.baseUrl}Payments`, paymentInfoInput).pipe(
      tap(response => {
        console.log('Gelen Yanıt:', response);
      })
    );
  }
}
