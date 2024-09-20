import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Basket } from '../models/basket/basket';
import { BasketItem } from '../models/basket/basketItem';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private basketBaseUrl = `${environment.gatewayBaseUri}/${environment.basketPath}`;
  private discountBaseUrl = `${environment.gatewayBaseUri}/${environment.discountPath}`;
  basket!: Basket;
  basketItems: BasketItem[] = [];
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
          basket = {
            userId: this.getUserIdFromToken(), 
            discountCode: "", 
            discountRate: 0, 
            totalPrice: basketItem.price, 
            basketItems: [basketItem]
        } as Basket;
          console.log(basket)
        }
        return this.saveOrUpdate(basket);
      }),
      catchError((error) => {
        console.error('Add Basket Item error:', error);
        return of(); 
      })
    );
  }

  applyDiscount(discountCode: string): Observable<boolean> {
    return this.cancelApplyDiscount().pipe(
      tap(() => console.log('Cancel Apply Discount called')),
      switchMap(() => this.get()),
      switchMap((basket) => {
        if (!basket) {
          console.error('Basket not found.');
          return of();
        }
  
        return this.httpClient.get<any>(`${this.discountBaseUrl}discounts/getbycode/${discountCode}`).pipe(
          switchMap((response) => {
            const discount = response?.data;
  
            if (!discount) {
              console.log('Discount not found.');
              return of(); 
            }
  
            basket.discountCode = discount.code;
            basket.discountRate = discount.rate;
            
            return this.saveOrUpdate(basket);
            
          }),
          tap((isSuccessful) => {
            if (isSuccessful) {
              console.log('Basket updated successfully.');
            } else {
              console.log('Basket update failed.');
            }
          }),
          catchError((error) => {
            console.error('Discount apply error:', error);
            return of(); 
          })
        );
      }),
      catchError((error) => {
        console.error('Apply discount process error:', error);
        return of(); 
      })
    );
  }

  
  cancelApplyDiscount(): Observable<boolean> {
    return this.get().pipe(
      switchMap((basket) => {
        if (!basket || !basket.discountCode) {
          // Sepet bulunamazsa veya indirim kodu yoksa false döndür
          return of(false);
        }
  
        // İndirim kodunu ve oranını temizle
        basket.discountCode = "";
        basket.discountRate = 0;
  
        // Sepeti güncelle
        return this.saveOrUpdate(basket).pipe(
          map((isSuccessful) => {
            // Sepet güncelleme başarılıysa true, başarısızsa false döndür
            return isSuccessful !== null;
          })
        );
      }),
      catchError((error) => {
        console.error('Cancel apply discount error:', error);
        return of(false); // Hata durumunda false döndür
      })
    );
  }


  
  removeBasketItem(productId: string): Observable<boolean> {
    return this.get().pipe(
      switchMap((basket) => {
        if (!basket) {
          return of();
        }
  
        const index = basket.basketItems?.findIndex((x) => x.productId === productId);
        if (index === -1 || index === undefined) {
          return of();
        }
  
        basket.basketItems?.splice(index, 1);
  
        if (basket.basketItems?.length === 0) {
          basket.discountCode = "";
        }
  
        return this.saveOrUpdate(basket);
      }),
      catchError((error) => {
        console.error('Remove Basket Item error:', error);
        return of(); 
      })
    );
  }
  
  get(): Observable<Basket | null> { // Updated return type to allow null
    return this.httpClient.get<{ data: Basket }>(`${this.basketBaseUrl}Baskets`).pipe(
      map(response => response.data),
      catchError((error) => {
        // Check if the error is a 404
        if (error.status === 404) {
          console.warn('Basket not found, creating a new one.');
          return of(null); // Return null or an empty basket
        }
        console.error('Error retrieving basket.', error);
        return throwError(() => new Error('Error retrieving basket.'));
      })
    );
  }
  
  
  
  saveOrUpdate(basket: Basket): Observable<boolean> {
    return this.httpClient.post<Basket>(`${this.basketBaseUrl}Baskets`, basket).pipe(
      map(() => true), // Başarı durumunda true döndür
      catchError((error) => {
        console.error('Error occurred while saving or updating basket:', error);
        return of(false); // Hata durumunda false döndür
      })
    );
  }


  deleteBasket(): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${this.basketBaseUrl}Baskets`);
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
