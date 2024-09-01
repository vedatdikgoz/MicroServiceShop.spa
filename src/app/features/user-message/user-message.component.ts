import { Component, OnInit } from '@angular/core';
import { UserMessageService } from '../../services/user-message.service';
import { Router } from '@angular/router';
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import { Message } from '../../models/userMessage/message';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-message',
  standalone: true,
  imports: [],
  templateUrl: './user-message.component.html',
  styleUrl: './user-message.component.css'
})
export class UserMessageComponent implements OnInit {

  messages: Message[] = [];
  errorMessage: string = ''; 
  userInfo:any;

  constructor(
    private userMessageService: UserMessageService, 
    private router: Router,
    private authService: AuthService) 
    {
     
    }
    async ngOnInit(): Promise<void> {
      try {
        this.loadMessages();
        await this.loadUserInfo();
        if (this.userInfo) {
          this.loadInboxMessages(this.userInfo.id);
        }
      } catch (error) {
        console.error('Error loading user info or orders', error);
      }
    }

  loadMessages(): void {
    this.userMessageService.getMessages().pipe(
      catchError((error) => {
        console.error('Mesajlar yüklenirken bir hata oluştu:', error);
        this.errorMessage = 'Mesajlar yüklenirken bir hata oluştu. Lütfen tekrar deneyin.';
        return of([]);
      })
    ).subscribe((messages: Message[]) => {
      this.messages = messages;
    });
  }

  loadInboxMessages(userId:string): void {
    this.userMessageService.getInboxMessages(userId).pipe(
      catchError((error) => {
        console.error('Gelen mesajlar yüklenirken bir hata oluştu:', error);
        this.errorMessage = 'Gelen mesajlar yüklenirken bir hata oluştu. Lütfen tekrar deneyin.';
        return of([]);
      })
    ).subscribe((messages: Message[]) => {
      this.messages = messages;
    });
  }


  async loadUserInfo(): Promise<void> {
    try {
      this.userInfo = await firstValueFrom(
        this.authService.getUserInfo().pipe(
          tap(userInfo => this.userInfo = userInfo),
          catchError(error => {
            console.error('Error fetching user info', error);
            return of(null); 
          })
        )
      );
    } catch (error) {
      console.error('Error loading user info', error);
      throw error;
    }
  }
}
