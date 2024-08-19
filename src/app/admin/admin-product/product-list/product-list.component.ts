import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/catalog/product';
import { CatalogService } from '../../../services/catalog.service';
import { catchError, of } from 'rxjs';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ProductImage } from '../../../models/catalog/productImage';

@Component({
  selector: 'product-list',
  standalone: true,
  imports: [CommonModule,RouterLink, RouterLinkActive],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  productImages: ProductImage[] = [];
  errorMessage: string = ''; 
  productId!: string;

  constructor(
    private catalogService: CatalogService, 
    private router: Router) 
    {
      this.loadProducts();
    }

  ngOnInit(): void {
    
  }

  loadProducts(): void {
    this.catalogService.getProducts().pipe(
      catchError((error) => {
        console.error('Ürünler yüklenirken bir hata oluştu:', error);
        this.errorMessage = 'Ürünler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.';
        return of([]);
      })
    ).subscribe((products: Product[]) => {
      this.products = products;
    });
  }


  loadProductImages(productId:string): void {
    this.catalogService.getProductImages(productId).pipe(
      catchError((error) => {
        console.error('Ürün resimleri yüklenirken bir hata oluştu:', error);
        this.errorMessage = 'Ürün resimleri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.';
        return of([]);
      })
    ).subscribe((productImages: ProductImage[]) => {
      this.productImages = productImages;
      console.log(productImages);
    });
  }


  deleteProduct(id:string): void {
    if (id) {
      this.catalogService.deleteProduct(id).pipe(
        catchError((error) => {
          console.error('Ürün silinirken bir hata oluştu:', error);
          return of(void 0); 
        })
      ).subscribe({
        next: () => {
          this.router.navigate(['/admin']); 
        },
        error: (error) => {
          console.error('Ürün silinirken bir hata oluştu:', error);
        }
      });
    }
  }



  openModel(productId: string) {
    this.productId = productId;
    if (productId) {
      this.loadProductImages(productId);
    }
    const modalDiv = document.getElementById('myModal');
    if (modalDiv != null) {
      modalDiv.style.display = 'block';
    }
  }

  CloseModel() {
    const modelDiv = document.getElementById('myModal');
    if(modelDiv!= null) {
      modelDiv.style.display = 'none';
    } 
  }
}

