import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CatalogService } from '../../../services/catalog.service';
import { catchError, of } from 'rxjs';
import { ProductDetail } from '../../../models/catalog/productDetail';

@Component({
  selector: 'product-detail-update',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink, RouterLinkActive],
  templateUrl: './product-detail-update.component.html',
  styleUrl: './product-detail-update.component.css'
})
export class ProductDetailUpdateComponent implements OnInit {
  productDetailUpdateForm!: FormGroup;
  productId!: string; 
  errorMessage: string = '';
  productDetail!: ProductDetail;

  constructor(
    private fb: FormBuilder,
    private catalogService: CatalogService,
    private route: ActivatedRoute,
    private router: Router
  ) 
  {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    this.loadProductDetail();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.productDetailUpdateForm = this.fb.group({
      id:[""],
      productInfo: ['', [Validators.required, Validators.maxLength(500)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      productId:[""],
    });
  }

  loadProductDetail(): void {
    this.catalogService.getProductDetail(this.productId).pipe(
      catchError((error) => {
        console.error('Ürün resimleri yüklenirken bir hata oluştu:', error);
        this.errorMessage = 'Ürün resimleri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.';
        return of("");
      })
    ).subscribe((response: any) => {
      this.productDetail = response.data;
      this.productDetailUpdateForm.patchValue(this.productDetail);
      console.log(this.productDetailUpdateForm)
    });
  }

  onSubmit(): void {
    if (this.productDetailUpdateForm.valid) {
      const updatedProductDetail: ProductDetail = this.productDetailUpdateForm.value;

      this.catalogService.updateProductDetail(updatedProductDetail).pipe(
        catchError((error) => {
          console.error('Ürün bilgisi güncellenirken bir hata oluştu:', error);
          return of(null);
        })
      ).subscribe({
        next: () => {
          this.router.navigate(['admin/product-list']);
        },
        error: (error) => {
          console.error('Ürün bilgisi güncellenirken bir hata oluştu:', error);
        }
      });
    }
  }
}
