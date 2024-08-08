import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/product';
import { CatalogService } from '../../../services/catalog.service';
import { catchError, of } from 'rxjs';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'product-list',
  standalone: true,
  imports: [CommonModule,RouterLink, RouterLinkActive],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  errorMessage: string = ''; 

  constructor(
    private catalogService: CatalogService, 
    private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
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
}
