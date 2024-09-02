import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ClientFooterComponent } from '../client-footer/client-footer.component';
import { AuthService } from '../../services/auth.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-client-home',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, ClientFooterComponent],
  templateUrl: './client-home.component.html',
  styleUrl: './client-home.component.css'
})
export class ClientHomeComponent implements OnInit {
  isLoggedIn = false;

  constructor(private authService: AuthService) 
  { 
    this.loadUserInfo();
  }

  userInfo:any;
  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.authService.getIsLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  loadUserInfo(): void {
    this.authService.getUserInfo().pipe(
      catchError((error) => {
        console.error('Bilgiler yüklenirken bir hata oluştu:', error);
        return of("");
      })
    ).subscribe((userInfo: any) => {
      this.userInfo = userInfo;
    });
  }

  onLogout() {
    this.authService.logout();
  }
}
