import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCategoryProductComponent } from './client-category-product.component';

describe('ClientCategoryProductComponent', () => {
  let component: ClientCategoryProductComponent;
  let fixture: ComponentFixture<ClientCategoryProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientCategoryProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientCategoryProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
