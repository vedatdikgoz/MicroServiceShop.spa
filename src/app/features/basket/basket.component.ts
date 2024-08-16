import { Component, OnInit } from '@angular/core';
import { BasketService } from '../../services/basket.service';
import { BasketItem } from '../../models/basket/basketItem';
import { Basket } from '../../models/basket/basket';
import { catchError, finalize, of, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'basket',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.css'
})
export class BasketComponent implements OnInit {
 
  basket!: Basket;
  basketItems: BasketItem[] = [];
  loading = false;
  counter: number = 1;

  constructor(private basketService: BasketService) { }

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
      next: (basket: Basket) => {
        if (basket) {
          this.basket = basket;
          this.basketItems = basket.basketItems || []; // Eğer basketItems undefined ise boş diziye ayarlıyoruz.
        } else {
          // Eğer basket undefined ise, boş bir sepet ve basketItems oluştur.
          this.basket = new Basket();
          this.basketItems = [];
        }
      },
      error: (error) => {
        console.error('Sepet verisini alırken bir hata oluştu:', error);
      }
    });
  }



  
 
  // appliedDiscount(discountPrice: number): void {
  //   this.basketItem._discountAppliedPrice = discountPrice;
  // }
 

}
