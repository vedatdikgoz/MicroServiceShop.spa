import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { map, Observable } from 'rxjs';
import { Message } from '../models/userMessage/message';

@Injectable({
  providedIn: 'root'
})
export class UserMessageService {

  constructor(private httpClient: HttpClient) { }

  private baseUrl = `${environment.gatewayBaseUri}/${environment.messagePath}`;

  getMessages(): Observable<Message[]> {
    return this.httpClient.get<{ data: Message[] }>(`${this.baseUrl}Messages`)
      .pipe(map(response => response.data))
  }

  getInboxMessages(id: string): Observable<Message[]> {
    return this.httpClient.get<{ data: Message[] }>(`${this.baseUrl}Orders/GetMessageInbox?id=${id}`)
      .pipe(map(response => response.data))
  }

  getSendboxMessages(id: string): Observable<Message[]> {
    return this.httpClient.get<{ data: Message[] }>(`${this.baseUrl}Orders/GetMessageSendbox?id=${id}`)
      .pipe(map(response => response.data))
  }
}
