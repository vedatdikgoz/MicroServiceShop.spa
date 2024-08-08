import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CatalogService } from '../../../services/catalog.service';
import { Category } from '../../../models/category';

@Component({
  selector: 'category-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent {
  constructor(private catalogService: CatalogService) {
  }
  categories!: Category[];

  ngOnInit() {
    this.catalogService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }
}
