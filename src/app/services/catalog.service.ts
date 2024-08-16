import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../models/category';
import { map, Observable } from 'rxjs';
import { Product } from '../models/product';
import { ProductImage } from '../models/productImage';
import { ProductDetail } from '../models/productDetail';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  constructor(private httpClient: HttpClient) { }

  private baseUrl = `${environment.gatewayBaseUri}/${environment.catalogPath}`;

  getCategories(): Observable<Category[]> {
    return this.httpClient.get<{ data: Category[] }>(`${this.baseUrl}Categories`)
      .pipe(map(response => response.data));
  }

  getProducts(): Observable<Product[]> {
    return this.httpClient.get<{ data: Product[] }>(`${this.baseUrl}Products`)
      .pipe(map(response => response.data));
  }
  getProductById(productId: string): Observable<Product> {
    return this.httpClient.get<Product>(`${this.baseUrl}Products/${productId}`)
  }

  getProductsWithCategory(categoryId: string): Observable<Product[]> {
    return this.httpClient.get<{ data: Product[] }>(`${this.baseUrl}Products/productwithcategory?categoryId=${categoryId}`)
      .pipe(map(response => response.data));
  }

  getProductImages(productId: string): Observable<ProductImage[]> {
    return this.httpClient.get<{ data: ProductImage[] }>(`${this.baseUrl}ProductImages/getall/${productId}`)
      .pipe(map(response => response.data))
  }

  getProductDetail(productId: string): Observable<ProductDetail> {
    return this.httpClient.get<ProductDetail>(`${this.baseUrl}ProductDetails/product/${productId}`)
  }

  addCategory(category: Category): Observable<Category> {
    return this.httpClient.post<Category>(`${this.baseUrl}Categories`, category)
  }

  addProduct(product: Product): Observable<Product> {
    return this.httpClient.post<Product>(`${this.baseUrl}Products`, product)
  }

  updateProduct(product: Product): Observable<Product> {
    return this.httpClient.put<Product>(`${this.baseUrl}Products`, product);
  }


  deleteProduct(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}Products/${id}`);
  }


  updateProductDetail(productDetail: ProductDetail): Observable<ProductDetail> {
    return this.httpClient.put<ProductDetail>(`${this.baseUrl}ProductDetails`, productDetail);
  }
}
