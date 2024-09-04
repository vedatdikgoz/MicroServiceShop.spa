import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ClientFooterComponent } from '../client-footer/client-footer.component';
import { AuthService } from '../../services/auth.service';
import { catchError, of } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'app-client-home',
  standalone: true,
  imports: [RouterOutlet, 
    RouterLink, 
    RouterLinkActive, 
    CommonModule, 
    ClientFooterComponent,
    TranslateModule
],
  templateUrl: './client-home.component.html',
  styleUrl: './client-home.component.css'
})
export class ClientHomeComponent implements OnInit {
  isLoggedIn = false;
  lang:string ='';

  constructor(private authService: AuthService,private translateService: TranslateService) 
  { 
    this.loadUserInfo();
    this.translateService.setDefaultLang('tr');
    this.translateService.use(localStorage.getItem('lang') || 'tr')
  }

  userInfo:any;
  ngOnInit() {
    this.lang = localStorage.getItem('lang') || 'tr';
    this.isLoggedIn = this.authService.isAuthenticated();
    this.authService.getIsLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  ChangeLang(lang:any){
    const selectedLanguage = lang.target.value;
    localStorage.setItem('lang',selectedLanguage);
    this.translateService.use(selectedLanguage);
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
