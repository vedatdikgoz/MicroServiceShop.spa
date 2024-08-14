import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../models/category';
import { map, Observable } from 'rxjs';
import { Product } from '../models/product';
import { ProductImage } from '../models/productImage';
import { ProductDetail } from '../models/productDetail';

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
    return this.httpClient.get<Product>(this.path + "products/" + productId)
  }

  getProductsWithCategory(categoryId:string): Observable<Product[]> {
    return this.httpClient.get<{data: Product[]}>(this.path + "Products/productwithcategory?categoryId=" + categoryId)
    .pipe(map(response => response.data));
  }

  getProductImages(productId:string): Observable<ProductImage[]>{
    return this.httpClient.get<{data: ProductImage[]}>(this.path + "ProductImages/getall/" + productId)
    .pipe(map(response => response.data))
  }

  getProductDetail(productId:string): Observable<ProductDetail>{
    return this.httpClient.get<ProductDetail>(this.path + "ProductDetails/product/" + productId)
  }

  addCategory(category: Category): Observable<Category> {
    return this.httpClient.post<Category>(this.path + 'categories', category)
  }

  addProduct(product: Product): Observable<Product> {
    return this.httpClient.post<Product>(this.path + 'products', product)
  }

  updateProduct(product: Product): Observable<Product> {
    return this.httpClient.put<Product>(this.path + 'products', product);
  }


  deleteProduct(id: string): Observable<void> {
    return this.httpClient.delete<void>(this.path + 'Products/' + id);
  }


  updateProductDetail(productDetail: ProductDetail): Observable<ProductDetail> {
    return this.httpClient.put<ProductDetail>(this.path + 'ProductDetails', productDetail);
  }
}
