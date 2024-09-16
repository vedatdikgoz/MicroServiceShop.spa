import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { UserComment } from '../models/comment/userComment';
import { environment } from '../environments/environment';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  public connection: signalR.HubConnection;
  // Gelen değeri saklayacak BehaviorSubject
  private commentCounterSubject = new BehaviorSubject<number>(0);
  // Bileşenlerde abone olunacak Observable
  public commentCounter$ = this.commentCounterSubject.asObservable();

  constructor(private httpClient: HttpClient) {
    // Initialize the SignalR connection
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5018/commenthub")
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.connection.on("ReceiveCommentCount", (message: number) => {
      // Değeri BehaviorSubject üzerinden yayınla
      this.commentCounterSubject.next(message);
      console.log("Gelen Mesaj :", message);
    });


  }

 // Start connection
public async start() {
  try {
    await this.connection.start();
    console.log("Hub a bağlandı");

    // Now that the connection is established, invoke the method
    this.connection.invoke("SendCommentCount")
      .catch(err => console.error("Error invoking ReceiveMessage:", err));
  } catch (error) {
    console.log("Error while starting connection:", error);
  }
}



  private baseUrl = `${environment.gatewayBaseUri}/${environment.commentPath}`;

  getComments(): Observable<UserComment[]> {
    return this.httpClient.get<{ data: UserComment[] }>(`${this.baseUrl}Comments`)
      .pipe(map(response => response.data));
  }

  getCommentById(id: string): Observable<UserComment> {
    return this.httpClient.get<UserComment>(`${this.baseUrl}Comments/${id}`)
  }

  getCommentByProductId(productId: string): Observable<UserComment[]> {
    return this.httpClient.get<{ data: UserComment[] }>(`${this.baseUrl}Comments/getallbyproductid/${productId}`)
      .pipe(map(response => response.data))
  }

  deleteComment(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}Comments/${id}`);
  }

  updateComment(userComment: UserComment): Observable<UserComment> {
    return this.httpClient.put<UserComment>(`${this.baseUrl}Comments`, userComment)
  };


  addComment(comment: UserComment): Observable<UserComment> {
    return this.httpClient.post<UserComment>(`${this.baseUrl}Comments`, comment)
  }

}
