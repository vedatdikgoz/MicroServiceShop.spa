import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { Basket } from '../models/basket/basket';
import { BasketItem } from '../models/basket/basketItem';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private baseUrl = `${environment.gatewayBaseUri}/${environment.basketPath}`;
  basket!: Basket;
  constructor(private httpClient: HttpClient) { }


  addBasketItem(basketItem: BasketItem): Observable<boolean> {
    return this.get().pipe(
      switchMap((basket) => {
        if (basket) {
          const itemExists = basket.basketItems?.some(
            (x) => x.productId === basketItem.productId
          );

          if (!itemExists) {
            basket.basketItems?.push(basketItem);
          }
        } else {
          basket = { basketItems: [basketItem] } as Basket;
        }

        return this.saveOrUpdate(basket);
      })
    );
  }

  applyDiscount(discountCode: string): Observable<boolean> {
    return this.cancelApplyDiscount().pipe(
      switchMap(() => this.get()),
      switchMap((basket) => {
        if (!basket) {
          return of(false);
        }

        return this.httpClient.get<any>(`${this.baseUrl}discounts/${discountCode}`).pipe(
          switchMap((hasDiscount) => {
            if (!hasDiscount) {
              return of(false);
            }

            basket!.discountCode = hasDiscount.code;
            basket!.discountRate = hasDiscount.rate;
            return this.saveOrUpdate(basket!);
          })
        );
      })
    );
  }


  cancelApplyDiscount(): Observable<boolean> {
    return this.get().pipe(
      switchMap((basket) => {
        if (!basket || !basket.discountCode) {
          return of(false);
        }

        basket.discountCode = null;
        basket.discountRate = null;

        return this.saveOrUpdate(basket);
      })
    );
  }

  delete(): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${this.baseUrl}Baskets`);
  }

  get(): Observable<Basket> {
    return this.httpClient.get<Basket>(`${this.baseUrl}Baskets`).pipe(
      catchError(() => {
        const userId = this.getUserIdFromToken();
        const emptyBasket = new Basket(userId ?? '', this.basket ? this.basket.basketItems : []);
        return of(emptyBasket);
      })
    );
  }


  removeBasketItem(productId: string): Observable<boolean> {
    return this.get().pipe(
      switchMap((basket) => {
        if (!basket) {
          return of(false);
        }

        const index = basket.basketItems?.findIndex((x) => x.productId === productId);
        if (index === -1 || index === undefined) {
          return of(false);
        }

        basket.basketItems?.splice(index, 1);

        if (basket.basketItems?.length === 0) {
          basket.discountCode = null;
        }

        return this.saveOrUpdate(basket);
      })
    );
  }

  saveOrUpdate(basket: Basket): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.baseUrl}Baskets`, basket);
  }


  getUserIdFromToken(): string | null {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.sub;
    }
    return null;
  }
}
