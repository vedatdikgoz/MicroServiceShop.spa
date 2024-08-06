import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Category } from '../../models/category';
import { CatalogService } from '../../services/catalog.service';

@Component({
  selector: 'client-category-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-category-card.component.html',
  styleUrl: './client-category-card.component.css'
})
export class ClientCategoryCardComponent {
  constructor(private catalogService: CatalogService) {
  }
  categories!: Category[];

  ngOnInit() {
    this.catalogService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }
}
