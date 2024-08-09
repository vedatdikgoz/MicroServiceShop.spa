import { Component } from '@angular/core';
import { ClientCarouselComponent } from "../../client/client-carousel/client-carousel.component";
import { ClientCategoryCardComponent } from "../../client/client-category-card/client-category-card.component";
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'catalog',
  standalone: true,
  imports: [ClientCarouselComponent, ClientCategoryCardComponent, CommonModule,RouterLink, RouterLinkActive],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent {
  
}
