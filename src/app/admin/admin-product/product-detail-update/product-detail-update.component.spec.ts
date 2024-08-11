import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailUpdateComponent } from './product-detail-update.component';

describe('ProductDetailUpdateComponent', () => {
  let component: ProductDetailUpdateComponent;
  let fixture: ComponentFixture<ProductDetailUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
