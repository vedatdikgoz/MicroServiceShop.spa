import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CatalogService } from '../../services/catalog.service';
import { Product } from '../../models/catalog/product';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'client-category-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-category-product.component.html',
  styleUrl: './client-category-product.component.css'
})
export class ClientCategoryProductComponent implements OnInit {
  categoryId: string | null = null;
  products: Product[] = [];
  errorMessage: string = '';

  constructor(private route: ActivatedRoute, private catalogService: CatalogService) { }

  ngOnInit(): void {

    this.categoryId = this.route.snapshot.paramMap.get('id');

    if (this.categoryId) {
      this.loadProducts(this.categoryId);
    } else {
      this.errorMessage = 'Kategori ID bulunamadı.';
    }
  }


  loadProducts(categoryId:string): void {
    this.catalogService.getProductsWithCategory(categoryId).pipe(
      catchError((error) => {
        console.error('Ürünler yüklenirken bir hata oluştu:', error);
        this.errorMessage = 'Ürünler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.';
        return of([]);
      })
    ).subscribe((products: Product[]) => {
      this.products = products;
      console.log(products);
    });
  }
}
