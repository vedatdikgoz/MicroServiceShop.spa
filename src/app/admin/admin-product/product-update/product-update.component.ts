import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogService } from '../../../services/catalog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../models/product';
import { catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';

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

  constructor(
    private fb: FormBuilder,
    private catalogService: CatalogService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || ''; // URL'den ID'yi al
    this.initializeForm();
    this.loadProduct();
  }

  initializeForm(): void {
    this.productUpdateForm = this.fb.group({
      name: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      image: [''],
      description: [''],
      categoryId: [null, Validators.required]
    });
  }

  loadProduct(): void {
    this.catalogService.getProductById(this.productId).subscribe((product: Product) => {
      this.productUpdateForm.patchValue(product);
    });
  }

  onSubmit(): void {
    if (this.productUpdateForm.valid) {
      const updatedProduct: Product = { ...this.productUpdateForm.value, id: this.productId };

      this.catalogService.updateProduct(updatedProduct).pipe(
        catchError((error) => {
          console.error('Ürün güncellenirken bir hata oluştu:', error);
          return of(null); 
        })
      ).subscribe({
        next: () => {
          this.router.navigate(['/product-list']);
        },
        error: (error) => {
          console.error('Ürün güncellenirken bir hata oluştu:', error);
        }
      });
    }
  }
}
