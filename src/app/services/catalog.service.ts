import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../models/category';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  constructor(private httpClient: HttpClient) { }
  path = "http://localhost:5011/api/";

  getCategories(): Observable<Category[]> {
    return this.httpClient.get<{ data: Category[] }>(this.path + "Categories")
    .pipe(map(response => response.data));
  }
}
