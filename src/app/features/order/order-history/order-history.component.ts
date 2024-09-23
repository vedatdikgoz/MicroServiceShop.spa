import { Component, OnInit } from '@angular/core';
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import { OrderService } from '../../../services/order.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { OrderCreateInput } from '../../../models/order/orderCreateInput';

@Component({
  selector: 'order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit {
  orders: OrderCreateInput[] = [];
  errorMessage: string = '';
  userInfo:any;

  constructor(
    private orderService: OrderService,
    private authService: AuthService) {}

 
  async ngOnInit(): Promise<void> {
    try {
      await this.loadUserInfo();
      if (this.userInfo) {
        this.loadOrders();
      }
    } catch (error) {
      console.error('Error loading user info or orders', error);
    }
  }

  loadOrders(): void {
    this.orderService.getOrders().pipe(
      catchError((error) => {
        console.error('Sipariş geçimişi yüklenirken bir hata oluştu:', error);
        this.errorMessage = 'Sipariş geçimişi yüklenirken bir hata oluştu. Lütfen tekrar deneyin.';
        return of([]);
      })
    ).subscribe((orders: OrderCreateInput[]) => {
      this.orders = orders;
      
    });
  }

 

  async loadUserInfo(): Promise<void> {
    try {
      this.userInfo = await firstValueFrom(
        this.authService.getUserInfo().pipe(
          tap(userInfo => this.userInfo = userInfo),
          catchError(error => {
            console.error('Error fetching user info', error);
            return of(null); 
          })
        )
      );
    } catch (error) {
      console.error('Error loading user info', error);
      throw error;
    }
  }
}
