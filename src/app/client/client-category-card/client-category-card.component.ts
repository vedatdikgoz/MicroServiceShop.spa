import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Category } from '../../models/catalog/category';
import { CatalogService } from '../../services/catalog.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'client-category-card',
  standalone: true,
  imports: [CommonModule,RouterLink, RouterLinkActive],
  templateUrl: './client-category-card.component.html',
  styleUrl: './client-category-card.component.css'
})
export class ClientCategoryCardComponent {
  constructor(private catalogService: CatalogService, private router:Router) 
  {
    this.loadCategories()
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
    });
  }
}
