import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserComment } from '../models/userComment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private httpClient: HttpClient) { }
  path = "http://localhost:5018/api/";


  getComments(): Observable<UserComment[]> {
    return this.httpClient.get<{ data: UserComment[] }>(this.path + "Comments")
      .pipe(map(response => response.data));
  }

  getCommentById(id: string): Observable<UserComment> {
    return this.httpClient.get<UserComment>(this.path + "Comments/" + id)
  }

  getCommentByProductId(productId: string): Observable<UserComment[]> {
    return this.httpClient.get<{ data: UserComment[] }>(this.path + "Comments/getallbyproductid/" + productId)
    .pipe(map(response => response.data))
  }

  deleteComment(id: string): Observable<void> {
    return this.httpClient.delete<void>(this.path + 'Comments/' + id,);
  }

  updateComment(userComment: UserComment): Observable<UserComment> {
    return this.httpClient.put<UserComment>(this.path + 'Comments', userComment)
    };


    addComment(comment: UserComment): Observable<UserComment> {
      return this.httpClient.post<UserComment>(this.path + 'Comments', comment)
    }
  
}
