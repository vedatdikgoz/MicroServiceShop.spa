import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserComment } from '../../../models/comment/userComment';
import { CommentService } from '../../../services/comment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'comment-update',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './comment-update.component.html',
  styleUrl: './comment-update.component.css'
})
export class CommentUpdateComponent implements OnInit {
  commentUpdateForm!: FormGroup;
  id!: string; 
  errorMessage: string = '';
  userComment: UserComment = new UserComment;

  constructor(
    private fb: FormBuilder,
    private commentService: CommentService,
    private router: Router,
    private route: ActivatedRoute
  ) 
  {
    this.id = this.route.snapshot.paramMap.get('id') || '';  
    this.loadComment();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.commentUpdateForm = this.fb.group({
      id: ['', Validators.required],
      nameSurname: ['', Validators.required],
      email: ['', Validators.required],
      imageUrl: [''],
      commentDetail: [''],
      rating: [''],
      createdDate: [''],
      productId: ['']
    });
  }


  loadComment(): void {
    this.commentService.getCommentById(this.id).pipe(
      catchError((error) => {
        console.error('Yorum yüklenirken bir hata oluştu:', error);
        this.errorMessage = 'Yorum yüklenirken bir hata oluştu. Lütfen tekrar deneyin.';
        return of([]);
      })
    ).subscribe((response: any) => {
      this.userComment = response.data;
      this.commentUpdateForm.patchValue(this.userComment);
    });
  }

 

  onSubmit(): void {
    if (this.commentUpdateForm.valid) {
      const updatedUserComment: UserComment = this.commentUpdateForm.value;

      this.commentService.updateComment(updatedUserComment).pipe(
        catchError((error) => {
          console.error('Yorum güncellenirken bir hata oluştu:', error);
          return of(null);
        })
      ).subscribe({
        next: () => {
          this.router.navigate(['admin/comment-list']);
        },
        error: (error:any) => {
          console.error('Yorum güncellenirken bir hata oluştu:', error);
        }
      });
    }
  }
  
}
