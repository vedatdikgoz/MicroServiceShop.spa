import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CatalogService } from '../../../services/catalog.service';
import { Category } from '../../../models/catalog/category';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'category-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent {
  constructor(private catalogService: CatalogService) 
  {
    this.loadCategories();
  }
  categories!: Category[];
  errorMessage: string = '';

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
