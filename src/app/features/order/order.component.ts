import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Address } from '../../models/order/address';
import { BasketService } from '../../services/basket.service';
import { Basket } from '../../models/basket/basket';
import { BasketItem } from '../../models/basket/basketItem';
import { CommonModule } from '@angular/common';
import { CargoService } from '../../services/cargo.service';
import { CargoCompany } from '../../models/cargo/cargoCompany';

@Component({
  selector: 'order',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {
  basket = new Basket();
  basketItems: BasketItem[] = [];
  addressAddForm!: FormGroup;
  address!: Address;
  errorMessage: string = '';
  cargoCompanies: CargoCompany[] = [];

  constructor(
    private orderService: OrderService,
    private basketService: BasketService,
    private cargoService: CargoService,
    private fb: FormBuilder,
    private router: Router) { }


  ngOnInit(): void {
    this.initializeForm();
    this.loadBasket();
    this.loadCargoCompanies();
  }


  loadBasket(): void {
    this.basketService.get().subscribe({
      next: (basket: Basket) => {
        if (basket) {
          this.basket = basket;
          this.basketItems = (basket.basketItems || []).map(item => Object.assign(new BasketItem(), item));
        } 
      },
      error: (error) => {
        console.error('Sepet verisini alırken bir hata oluştu:', error);
      }
    });
  }


  initializeForm(): void {
    this.addressAddForm = this.fb.group({
      userId: ['', Validators.required],
      name: [''],
      surname: [''],
      email: [''],
      phone: [''],
      country: [''],
      province: [''],
      district: [''],
      adressLine: [''],
      adressLine2: [''],
      zipCode: ['']
    });
  }

  onSubmit(): void {
    if (this.addressAddForm.valid) {
      // Formdan gelen verileri Order modeline dönüştürme
      const newAddress: Address = this.addressAddForm.value;

      this.orderService.addAddress(newAddress).pipe(
        catchError((error) => {
          console.error('Sipariş eklenirken bir hata oluştu:', error);
          return of(null); // Hata durumunda boş bir değer döner
        })
      ).subscribe({
        next: () => {
          this.router.navigate(['']); // Başarıyla ekleme yapıldıktan sonra yönlendir
        },
        error: (error: any) => {
          console.error('Sipariş eklenirken bir hata oluştu:', error); // Ekstra hata işleme
        }
      });
    }
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
}
