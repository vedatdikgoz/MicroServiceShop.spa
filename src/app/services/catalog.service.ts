import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../models/category';
import { map, Observable } from 'rxjs';
import { Product } from '../models/product';

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

  getProducts(): Observable<Product[]> {
    return this.httpClient.get<{ data: Product[] }>(this.path + "Products")
      .pipe(map(response => response.data));
  }

  getProductById(productId: string): Observable<Product> {
    return this.httpClient.get<Product>(this.path + "products/?id=" + productId)
  }

  addCategory(category: Category): Observable<Category> {
    return this.httpClient.post<Category>(this.path + 'categories', category, {
      headers: new HttpHeaders({
        //"Authorization": `Bearer ${this.authService.token}`,
        //"Access-Control-Allow-Origin":"*"
      })
    })
  }

  addProduct(product: Product): Observable<Product> {
    return this.httpClient.post<Product>(this.path + 'products', product, {
      headers: new HttpHeaders({
        //"Authorization": `Bearer ${this.authService.token}`,
        //"Access-Control-Allow-Origin":"*"
      })
    })
  }

  updateProduct(product: Product): Observable<Product> {
    return this.httpClient.put<Product>(this.path + 'products', product,{
      headers: new HttpHeaders({
        //"Authorization": `Bearer ${this.authService.token}`,
        //"Access-Control-Allow-Origin":"*"
      })
    });
  }


  deleteProduct(id: string): Observable<void> {
    return this.httpClient.delete<void>(this.path + 'Products/' + id,{
      headers: new HttpHeaders({
        //"Authorization": `Bearer ${this.authService.token}`,
        //"Access-Control-Allow-Origin":"*"
      })
    });
  }
}
