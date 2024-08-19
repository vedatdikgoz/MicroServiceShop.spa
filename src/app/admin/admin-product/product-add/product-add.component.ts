import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogService } from '../../../services/catalog.service';
import { Router } from '@angular/router';
import { Product } from '../../../models/catalog/product';
import { Category } from '../../../models/catalog/category';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'product-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-add.component.html',
  styleUrl: './product-add.component.css'
})
export class ProductAddComponent implements OnInit {
  productAddForm!: FormGroup;
  categories!: Category[];
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private catalogService: CatalogService,
    private router: Router
  ) 
  {
    this.loadCategories()
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.productAddForm = this.fb.group({
      name: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      description: [''],
      categoryId: [null, Validators.required]
    });
  }

  loadCategories(): void {
    this.catalogService.getCategories().pipe(
      catchError((error) => {
        console.error('Kategoriler yüklenirken bir hata oluştu:', error);
        this.errorMessage = 'Kategoriler yüklenirken bir hata oluştu.';
        return of([]);
      })
    ).subscribe((categories: Category[]) => {
      this.categories = categories;
    });
  }

  onSubmit(): void {
    if (this.productAddForm.valid) {
      // Formdan gelen verileri Product modeline dönüştürme
      const newProduct: Product = this.productAddForm.value;

      this.catalogService.addProduct(newProduct).pipe(
        catchError((error) => {
          console.error('Ürün eklenirken bir hata oluştu:', error);
          return of(null); // Hata durumunda boş bir değer döner
        })
      ).subscribe({
        next: () => {
          this.router.navigate(['/admin']); // Başarıyla ekleme yapıldıktan sonra yönlendir
        },
        error: (error) => {
          console.error('Ürün eklenirken bir hata oluştu:', error); // Ekstra hata işleme
        }
      });
    }
  }
}
