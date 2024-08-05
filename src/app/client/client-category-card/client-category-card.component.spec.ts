import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCategoryCardComponent } from './client-category-card.component';

describe('ClientCategoryCardComponent', () => {
  let component: ClientCategoryCardComponent;
  let fixture: ComponentFixture<ClientCategoryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientCategoryCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientCategoryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
