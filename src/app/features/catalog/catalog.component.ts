import { Component, OnInit } from '@angular/core';
import { ClientCarouselComponent } from "../../client/client-carousel/client-carousel.component";
import { ClientCategoryCardComponent } from "../../client/client-category-card/client-category-card.component";
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Product } from '../../models/catalog/product';
import { CatalogService } from '../../services/catalog.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'catalog',
  standalone: true,
  imports: [ClientCarouselComponent, ClientCategoryCardComponent, CommonModule,RouterLink, RouterLinkActive],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
  products: Product[] = [];
  errorMessage: string = ''; 

  constructor(
    private catalogService: CatalogService) 
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
}




