import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { Product } from '../../../../models/catalog/product';
import { CatalogService } from '../../../../services/catalog.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'category-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-product-list.component.html',
  styleUrl: './category-product-list.component.css'
})
export class CategoryProductListComponent implements OnInit {

  errorMessage: string = '';
  categoryId: string | null = null;
  products: Product[] = [];

  constructor(private route: ActivatedRoute, private catalogService: CatalogService) {
    this.categoryId = this.route.snapshot.paramMap.get('id');

    if (this.categoryId) {
      this.loadCategoryProducts(this.categoryId);
    } else {
      this.errorMessage = 'Kategori ID bulunamadı.';
    }
  }

  ngOnInit(): void {

  }

  loadCategoryProducts(categoryId: string): void {
    if (categoryId) {
      this.catalogService.getProductsWithCategory(categoryId).pipe(
        catchError((error) => {
          console.error('Ürünler yüklenirken bir hata oluştu:', error);
          this.errorMessage = 'Ürünler yüklenirken bir hata oluştu.';
          return of([]);
        })
      ).subscribe((products: Product[]) => {
        this.products = products;
        console.log(products);
      });
    }
  }
}
