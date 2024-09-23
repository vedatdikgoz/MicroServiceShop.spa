import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, lastValueFrom, of } from 'rxjs';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Address } from '../../models/order/address';
import { BasketService } from '../../services/basket.service';
import { Basket } from '../../models/basket/basket';
import { BasketItem } from '../../models/basket/basketItem';
import { CommonModule } from '@angular/common';
import { CargoService } from '../../services/cargo.service';
import { CargoCompany } from '../../models/cargo/cargoCompany';
import { OrderCreateInput } from '../../models/order/orderCreateInput';
import { OrderItemCreateInput } from '../../models/order/orderItemCreateInput';
import { PaymentService } from '../../services/payment.service';
import { PaymentInfoInput } from '../../models/payment/paymentInfoInput';
import { AuthService } from '../../services/auth.service';
import { CheckoutInfoInput } from '../../models/order/checkoutInfoInput';

@Component({
  selector: 'order',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {
  basket = new Basket();
  basketItems: BasketItem[] = [];
  orderCreateForm!: FormGroup;
  address!: Address;
  errorMessage: string = '';
  cargoCompanies: CargoCompany[] = [];
  selectedPaymentMethod: string = '';  // Seçilen ödeme yöntemi
  showCardDetails: boolean = false;    // Kart bilgileri formunu gösterme

  constructor(
    private orderService: OrderService,
    private basketService: BasketService,
    private cargoService: CargoService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router) { }


  ngOnInit(): void {
    this.initializeForm();
    this.loadBasket();
    this.loadCargoCompanies();
  }


  onPaymentMethodChange(method: string) {
    this.selectedPaymentMethod = method;
    if (method === 'banktransfer') {
      this.showCardDetails = true;     // Banka/Kredi Kartı seçildiyse kart bilgilerini göster
    } else {
      this.showCardDetails = false;    // Diğer durumlarda kart bilgilerini gizle
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
  


  initializeForm(): void {
    this.orderCreateForm = this.fb.group({
      country: [''],
      province: [''],
      district: [''],
      addressLine: [''],
      zipCode: [''],
      cardName: [''],
      cardNumber: [''],
      expiration: [''],
      cvv: [''],
    });
  }

  onSubmit(): void {
    if (this.orderCreateForm.invalid) {
      return; // Eğer form geçersizse işleme devam etme.
    }
    const checkoutInfoInput: CheckoutInfoInput = this.orderCreateForm.value;
  
    this.suspendOrder(checkoutInfoInput).then((result) => {
      if (result) {
        // İşlem başarılı olduğunda yapılacak işlemler (örn. bildirim gösterme, yönlendirme).
        console.log('Order suspended successfully');
      } else {
        // Ödeme başarısız olursa yapılacak işlemler.
        console.error('Payment failed');
      }
    });
  }
  

  loadCargoCompanies(): void {
    this.cargoService.getCargoCompanies().pipe(
      catchError((error) => {
        console.error('Kargo firmaları yüklenirken bir hata oluştu:', error);
        this.errorMessage = 'Kargo firmaları yüklenirken bir hata oluştu. Lütfen tekrar deneyin.';
        return of([]);
      })
    ).subscribe((cargoCompanies: CargoCompany[]) => {
      this.cargoCompanies = cargoCompanies;
    });
  }


  async suspendOrder(checkoutInfoInput: CheckoutInfoInput): Promise<boolean> {
    // Use `lastValueFrom` to handle Observables.
    const basket = await lastValueFrom(this.basketService.get());
  
    const orderCreateInput: OrderCreateInput = {
      buyerId: this.authService.getUserIdFromToken() ?? undefined,
      address: {
        country: checkoutInfoInput.country,
        province: checkoutInfoInput.province,
        district: checkoutInfoInput.district,
        addressLine: checkoutInfoInput.addressLine,
        zipCode: checkoutInfoInput.zipCode,
      },
      orderItems: [],
    };
  
    basket!.basketItems.forEach((x) => {
      const orderItem: OrderItemCreateInput = {
        productId: x.productId,
        price: x.price,
        pictureUrl: '',
        productName: x.productName,
      };
      orderCreateInput.orderItems.push(orderItem);
    });
  
    const paymentInfoInput: PaymentInfoInput = {
      cardName: checkoutInfoInput.cardName,
      cardNumber: checkoutInfoInput.cardNumber,
      expiration: checkoutInfoInput.expiration,
      cvv: checkoutInfoInput.cvv,
      totalPrice: basket!.totalPrice,
      order: orderCreateInput,
    };
  
    // Use `lastValueFrom` to handle Observables for payment service.
    console.log(paymentInfoInput)
    const responsePayment = await lastValueFrom(this.paymentService.receivePayment(paymentInfoInput));
    if (!responsePayment) {
      return false;
    }
  
    // Use `lastValueFrom` to handle delete basket.
    await lastValueFrom(this.basketService.deleteBasket());
    this.orderCreateForm.reset();
    this.router.navigate(['checkout']);
    return true;
  }
  

}
