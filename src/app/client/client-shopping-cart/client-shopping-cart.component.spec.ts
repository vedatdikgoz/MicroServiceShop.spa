import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientShoppingCartComponent } from './client-shopping-cart.component';

describe('ClientShoppingCartComponent', () => {
  let component: ClientShoppingCartComponent;
  let fixture: ComponentFixture<ClientShoppingCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientShoppingCartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientShoppingCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
