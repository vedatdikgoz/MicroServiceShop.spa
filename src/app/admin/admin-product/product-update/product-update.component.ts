import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogService } from '../../../services/catalog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/product';
import { catchError, of } from 'rxjs';
import { Category } from '../../../models/category';

@Component({
  selector: 'product-update',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './product-update.component.html',
  styleUrl: './product-update.component.css'
})

export class ProductUpdateComponent implements OnInit {
  productUpdateForm!: FormGroup;
  productId!: string; 
  categories: Category[] = [];
  errorMessage: string = '';
  product: Product = new Product;

  constructor(
    private fb: FormBuilder,
    private catalogService: CatalogService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || ''; // URL'den ID'yi al
    this.initializeForm();
    this.loadCategories();
    this.loadProduct();
  }

  initializeForm(): void {
    this.productUpdateForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      description: [''],
      categoryName: ['', Validators.required],
      categoryId: ['', Validators.required]
    });
  }


  loadProduct(): void {
    this.catalogService.getProductById(this.productId).pipe(
      catchError((error) => {
        console.error('Ürün resimleri yüklenirken bir hata oluştu:', error);
        this.errorMessage = 'Ürün resimleri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.';
        return of([]);
      })
    ).subscribe((response: any) => {
      this.product = response.data;
      this.productUpdateForm.patchValue(this.product);
    });
  }

 
  loadCategories(): void {
    this.catalogService.getCategories().pipe(
      catchError((error) => {
        console.error('Ürün resimleri yüklenirken bir hata oluştu:', error);
        this.errorMessage = 'Ürün resimleri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.';
        return of([]);
      })
    ).subscribe((categories: Category[]) => {
      this.categories = categories;
      console.log(categories);
    });
  }

  onSubmit(): void {
    if (this.productUpdateForm.valid) {
      const updatedProduct: Product = this.productUpdateForm.value;

      this.catalogService.updateProduct(updatedProduct).pipe(
        catchError((error) => {
          console.error('Ürün güncellenirken bir hata oluştu:', error);
          return of(null);
        })
      ).subscribe({
        next: () => {
          this.router.navigate(['admin/product-list']);
        },
        error: (error) => {
          console.error('Ürün güncellenirken bir hata oluştu:', error);
        }
      });
    }
  }
  
}
