import { Component } from '@angular/core';
import { ClientCarouselComponent } from "../../client/client-carousel/client-carousel.component";
import { ClientCategoryCardComponent } from "../../client/client-category-card/client-category-card.component";

@Component({
  selector: 'catalog',
  standalone: true,
  imports: [ClientCarouselComponent, ClientCategoryCardComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent {
  
}
