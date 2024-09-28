import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/catalog/product';
import { CatalogService } from '../../../services/catalog.service';
import { catchError, of, switchMap, tap } from 'rxjs';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ProductImage } from '../../../models/catalog/productImage';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PhotoService } from '../../../services/photo.service';

@Component({
  selector: 'product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  productImages: ProductImage[] = [];
  productImage!: ProductImage;
  errorMessage: string = '';
  productId!: string;
  productImagesAddForm!: FormGroup;
  selectedFiles: File[] = [];

  constructor(
    private catalogService: CatalogService,
    private photoService: PhotoService,
    private router: Router,
    private fb: FormBuilder) {
    this.loadProducts();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.productImagesAddForm = this.fb.group({
      image1: [''],
      image2: [''],
      image3: [''],
      productId: ['']
    });
  }

  onFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[index - 1] = file; // Array'de doğru konuma yerleştirmek için index - 1    
    }
  }


  onSubmit(): void {
    if (this.productImagesAddForm.valid) {
      this.photoService.uploadPhotos(this.selectedFiles)
        .pipe(
          tap((response: any) => {
            const urls = response.data.map((item: { url: string }) => item.url);
            const image1Url = urls[0] || '';
            const image2Url = urls[1] || '';
            const image3Url = urls[2] || '';
            this.productImage = {
              id: '',
              image1: image1Url,
              image2: image2Url,
              image3: image3Url,
              productId: this.productId
            };
          }),
          switchMap(() => this.catalogService.addProductImages(this.productImage)), // Upload başarılıysa addProduct'ı çağır
          catchError((error) => {
            console.error('Ürün resimleri eklenirken bir hata oluştu:', error);
            return of(null); // Hata durumunda boş bir değer döner
          })
        )
        .subscribe({
          next: () => {
            this.productImagesAddForm.reset()
            this.router.navigate(['admin/product-list']); // Başarıyla ekleme yapıldıktan sonra yönlendir
          },
          error: (error) => {
            console.error('Ürün resimleri eklenirken bir hata oluştu:', error); // Ekstra hata işleme
          }
        });
    }
  }

  loadProducts(): void {
    this.catalogService.getProducts().pipe(
      catchError((error) => {
        console.error('Ürünler yüklenirken bir hata oluştu:', error);
        this.errorMessage = 'Ürünler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.';
        return of([]);
      })
    ).subscribe((products: Product[]) => {
      this.products = products;
    });
  }


  loadProductImages(productId: string): void {
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


  deleteProduct(id: string): void {
    if (id) {
      this.catalogService.deleteProduct(id).pipe(
        catchError((error) => {
          console.error('Ürün silinirken bir hata oluştu:', error);
          return of(void 0);
        })
      ).subscribe({
        next: () => {
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          console.error('Ürün silinirken bir hata oluştu:', error);
        }
      });
    }
  }



  openModel(productId: string) {
    this.productId = productId;
    if (productId) {
      this.loadProductImages(productId);
    }
    const modalDiv = document.getElementById('myModal');
    if (modalDiv != null) {
      modalDiv.style.display = 'block';
    }
  }

  CloseModel() {
    const modelDiv = document.getElementById('myModal');
    if (modelDiv != null) {
      modelDiv.style.display = 'none';
    }
  }


  openImagesModel(productId: string) {
    this.productId = productId;
    if (productId) {

    }
    const modalDiv = document.getElementById('myImagesModal');
    if (modalDiv != null) {
      modalDiv.style.display = 'block';
    }
  }

  closeImagesModel() {
    const modelDiv = document.getElementById('myImagesModal');
    this.selectedFiles = [];
    if (modelDiv != null) {
      modelDiv.style.display = 'none';
    }
  }
}

