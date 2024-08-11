import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogService } from '../../../services/catalog.service';
import { Router } from '@angular/router';
import { Product } from '../../../models/product';
import { Category } from '../../../models/category';
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
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private catalogService: CatalogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.catalogService
    .getCategories()
    .subscribe(categories => this.categories = categories);
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
    this.catalogService.getCategories().pipe().subscribe((categories: Category[]) => 
      {
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
