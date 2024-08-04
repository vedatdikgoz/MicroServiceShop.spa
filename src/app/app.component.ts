import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { CatalogComponent } from "./features/catalog/catalog.component";
import { CarouselComponent } from "./carousel/carousel.component";
import { CategoryComponent } from "./category/category.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CatalogComponent, CarouselComponent, CategoryComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MicroServiceShop.spa';
}
