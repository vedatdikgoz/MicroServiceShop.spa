import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CatalogComponent } from "./features/catalog/catalog.component";
import { ClientFooterComponent } from './client/client-footer/client-footer.component';
import { ClientCarouselComponent } from './client/client-carousel/client-carousel.component';
import { ClientCategoryCardComponent } from './client/client-category-card/client-category-card.component';
import { ClientShoppingCartComponent } from './client/client-shopping-cart/client-shopping-cart.component';
import { LoginComponent } from './auth/login/login.component';
import { ClientCategoryProductComponent } from './client/client-category-product/client-category-product.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ClientFooterComponent,
    CatalogComponent,
    ClientCarouselComponent,
    ClientCategoryCardComponent,
    ClientShoppingCartComponent,
    ClientCategoryProductComponent,
    LoginComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MicroServiceShop.spa';
}
