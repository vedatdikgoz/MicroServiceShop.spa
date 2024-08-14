import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentUpdateComponent } from './comment-update.component';

describe('CommentUpdateComponent', () => {
  let component: CommentUpdateComponent;
  let fixture: ComponentFixture<CommentUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
