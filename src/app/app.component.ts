import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CatalogComponent } from "./features/catalog/catalog.component";
import { ClientNavbarComponent } from './client/client-navbar/client-navbar.component';
import { ClientFooterComponent } from './client/client-footer/client-footer.component';
import { ClientCarouselComponent } from './client/client-carousel/client-carousel.component';
import { ClientCategoryCardComponent } from './client/client-category-card/client-category-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    ClientNavbarComponent,
    ClientFooterComponent, 
    CatalogComponent, 
    ClientCarouselComponent, 
    ClientCategoryCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MicroServiceShop.spa';
}
