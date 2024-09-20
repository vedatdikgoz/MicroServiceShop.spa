import { Component, OnInit } from '@angular/core';
import { BasketService } from '../../services/basket.service';
import { BasketItem } from '../../models/basket/basketItem';
import { Basket } from '../../models/basket/basket';
import { catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'basket',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,RouterLink,RouterLinkActive],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.css'
})
export class BasketComponent implements OnInit {

  basket = new Basket();
  basketItems: BasketItem[] = [];
  loading = false;
  counter: number = 1;
  discountCode: string = '';  // Formdan alınan indirim kodunu tutacak değişken
  isDiscountApplied: boolean | null = null;  // İndirim kodunun başarılı olup olmadığını tutacak değişken

  constructor(
    private basketService: BasketService) {}

  ngOnInit() {
    this.loadBasket();
  }

  increment() {
    this.counter++;
  }

  decrement() {
    if (this.counter > 1) {
      this.counter--;
    }
  }



  loadBasket(): void {
    this.basketService.get().subscribe({
      next: (basket: Basket | null) => { // Update the type here to handle null
        if (basket) {
          this.basket = basket;
          this.basketItems = (basket.basketItems || []).map(item => Object.assign(new BasketItem(), item));
        } else {
          // Handle the case where the basket is null
          console.warn('No basket found. Initializing a new basket.');
          this.basket = new Basket(); 
          this.basketItems = [];
        }
      },
      error: (error) => {
        console.error('Error occurred while fetching the basket:', error);
      }
    });
  }



  applyDiscount(): void {
    this.basketService.applyDiscount(this.discountCode).subscribe((result) => {  
      if (result) {
        this.isDiscountApplied = true;
        console.log('Discount applied successfully');
      } else {
        this.isDiscountApplied = false;
        console.log('Failed to apply discount');
      }
    });
  }


  removeBasketItem(productId: string) {
    if (productId) {
      this.basketService.removeBasketItem(productId).pipe(
        catchError(err => {
          console.error('Error removing item', err);
          return of(false);
        })
      ).subscribe(success => {
        if (success) {
          this.loadBasket();
        }
      });
    }
  }

}
