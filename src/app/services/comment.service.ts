import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserComment } from '../models/comment/userComment';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private httpClient: HttpClient) { }
  
  private baseUrl = `${environment.gatewayBaseUri}/${environment.commentPath}`;

  getComments(): Observable<UserComment[]> {
    return this.httpClient.get<{ data: UserComment[] }>(`${this.baseUrl}Comments`)
      .pipe(map(response => response.data));
  }

  getCommentById(id: string): Observable<UserComment> {
    return this.httpClient.get<UserComment>(`${this.baseUrl}Comments/${id}`)
  }

  getCommentByProductId(productId: string): Observable<UserComment[]> {
    return this.httpClient.get<{ data: UserComment[] }>(`${this.baseUrl}Comments/getallbyproductid//${productId}`)
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
