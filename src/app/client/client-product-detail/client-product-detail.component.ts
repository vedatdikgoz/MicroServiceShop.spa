import { Component, Input } from '@angular/core';
import { ProductImage } from '../../models/productImage';
import { ActivatedRoute } from '@angular/router';
import { CatalogService } from '../../services/catalog.service';
import { catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ProductDetail } from '../../models/productDetail';

@Component({
  selector: 'client-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-product-detail.component.html',
  styleUrl: './client-product-detail.component.css'
})
export class ClientProductDetailComponent {
  productId: string | null = null;
  productImages: ProductImage[] = [];
  productDetail!: ProductDetail;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute, private catalogService: CatalogService) { }
  
  ngOnInit(): void {

    this.productId = this.route.snapshot.paramMap.get('id');

    if (this.productId) {
      this.loadProductImages(this.productId);
      this.loadProductDetail(this.productId);
    } else {
      this.errorMessage = 'Product ID bulunamadı.';
    }
  }

  loadProductImages(productId:string): void {
    this.catalogService.getProductImages(productId).pipe(
      catchError((error) => {
        console.error('Ürün resimleri yüklenirken bir hata oluştu:', error);
        this.errorMessage = 'Ürün resimleri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.';
        return of([]);
      })
    ).subscribe((productImages: ProductImage[]) => {
      this.productImages = productImages;
      console.log(productImages);
    });
  }

  loadProductDetail(productId:string): void {
    this.catalogService.getProductDetail(productId).pipe(
      catchError((error) => {
        console.error('Ürün resimleri yüklenirken bir hata oluştu:', error);
        this.errorMessage = 'Ürün resimleri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.';
        return of("");
      })
    ).subscribe((response: any) => {
      this.productDetail = response.data;
    });
  }
}