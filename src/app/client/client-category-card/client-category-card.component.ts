import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Category } from '../../models/catalog/category';
import { CatalogService } from '../../services/catalog.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'client-category-card',
  standalone: true,
  imports: [CommonModule,RouterLink, RouterLinkActive],
  templateUrl: './client-category-card.component.html',
  styleUrl: './client-category-card.component.css'
})
export class ClientCategoryCardComponent {
  constructor(private catalogService: CatalogService, private router:Router) {
  }
  categories!: Category[];

  ngOnInit() {
    this.catalogService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }
}
