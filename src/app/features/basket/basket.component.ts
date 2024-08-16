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
  basketItems!: BasketItem[];
  basketItem!: BasketItem;
  basket!: Basket;
  loading = false;

  constructor(private basketService: BasketService) { }

  ngOnInit() {
    this.loadBasket();
  }

  loadBasket(): void {
    this.loading = true;
  
    this.basketService.get().pipe(
      tap(data => this.basketItems = data?.basketItems || []),
      catchError(error => {
        console.error('Error loading basket', error);
        return of([]); 
      }),
      finalize(() => this.loading = false)
    ).subscribe();
  }



  
 
  appliedDiscount(discountPrice: number): void {
    this.basketItem._discountAppliedPrice = discountPrice;
  }
 

}
