import { Component, Input } from '@angular/core';
import { ProductImage } from '../../models/productImage';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogService } from '../../services/catalog.service';
import { catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ProductDetail } from '../../models/productDetail';
import { CommentService } from '../../services/comment.service';
import { UserComment } from '../../models/userComment';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'client-product-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-product-detail.component.html',
  styleUrl: './client-product-detail.component.css'
})
export class ClientProductDetailComponent {
  productId: string | null = null;
  productImages: ProductImage[] = [];
  productComments: UserComment[] = [];
  productDetail!: ProductDetail;
  errorMessage: string = '';
  commentAddForm!: FormGroup;
  commentCounter!:number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute, 
    private router: Router,
    private catalogService: CatalogService,
    private commentService: CommentService) { }
  
  ngOnInit(): void {

    this.productId = this.route.snapshot.paramMap.get('id');

    if (this.productId) {
      this.loadProductImages(this.productId);
      this.loadProductDetail(this.productId);
      this.loadProductComments(this.productId);
    } else {
      this.errorMessage = 'Product ID bulunamadı.';
    }
    this.initializeForm();
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


  loadProductComments(productId:string): void {
    this.commentService.getCommentByProductId(productId).pipe(
      catchError((error) => {
        console.error('Ürün yorumları yüklenirken bir hata oluştu:', error);
        this.errorMessage = 'Ürün yorumları yüklenirken bir hata oluştu. Lütfen tekrar deneyin.';
        return of([]);
      })
    ).subscribe((productComments: UserComment[]) => {
      this.productComments = productComments;
      this.commentCounter = productComments.length; 
    });
  }

  initializeForm(): void {
    this.commentAddForm = this.fb.group({
      nameSurname: ['', Validators.required],
      email: ['', Validators.required],
      imageUrl: [''],
      commentDetail: [''],
      rating: ['', [Validators.required, Validators.pattern('^[1-5]*$')]],
      createdDate: [new Date().toISOString(), Validators.required],
      productId: this.productId
    });
  }

  onSubmit(): void {
    if (this.commentAddForm.valid) {
      const newUserComment: UserComment = this.commentAddForm.value;
      console.log(newUserComment)
      this.commentService.addComment(newUserComment).pipe(
        catchError((error) => {
          console.error('Yorum eklenirken bir hata oluştu:', error);
          return of(null);
        })
      ).subscribe({
        next: () => {
          this.router.navigate(['home']);
        },
        error: (error) => {
          console.error('Yorum eklenirken bir hata oluştu:', error); 
        }
      });
    }
  }
}