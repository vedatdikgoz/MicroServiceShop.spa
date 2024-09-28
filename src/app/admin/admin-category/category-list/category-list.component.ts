import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CatalogService } from '../../../services/catalog.service';
import { Category } from '../../../models/catalog/category';
import { catchError, of } from 'rxjs';
import { Product } from '../../../models/catalog/product';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'category-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent {

  categories!: Category[];
  errorMessage: string = '';
  categoryId: string | null = null;
  products: Product[] = [];

  constructor(private catalogService: CatalogService) 
  {
    this.loadCategories();
  }

  ngOnInit() {
  }

  loadCategories(): void {
    this.catalogService.getCategories().pipe(
      catchError((error) => {
        console.error('Kategoriler yüklenirken bir hata oluştu:', error);
        this.errorMessage = 'Kategoriler yüklenirken bir hata oluştu.';
        return of([]);
      })
    ).subscribe((categories: Category[]) => {
      this.categories = categories;
      console.log(categories);
    });
  }
}
