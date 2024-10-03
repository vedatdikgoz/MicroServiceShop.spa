import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CommentService } from '../../../services/comment.service';
import { catchError, of } from 'rxjs';
import { UserComment } from '../../../models/comment/userComment';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'comment-list',
  standalone: true,
  imports: [CommonModule,RouterLink, RouterLinkActive],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.css'
})
export class CommentListComponent {
  errorMessage: string = '';
  userComments: UserComment[] = [];

  constructor(
    private commentService: CommentService,private router: Router) 
    {
      this.loadComments();
    }

  ngOnInit(): void {
    
  }

  loadComments(): void {
    this.commentService.getComments().pipe(
      catchError((error) => {
        console.error('Yorumlar yüklenirken bir hata oluştu:', error);
        this.errorMessage = 'Yorumlar yüklenirken bir hata oluştu. Lütfen tekrar deneyin.';
        return of([]);
      })
    ).subscribe((userComments: UserComment[]) => {
      this.userComments = userComments;
    });
  }

  deleteComment(id:string): void {
    if (id) {
      this.commentService.deleteComment(id).pipe(
        catchError((error) => {
          console.error('Yorum silinirken bir hata oluştu:', error);
          return of(void 0); 
        })
      ).subscribe({
        next: () => {
          this.router.navigate(['/admin']); 
        },
        error: (error: any) => {
          console.error('Yorum silinirken bir hata oluştu:', error);
        }
      });
    }
  }
}
