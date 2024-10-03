import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterUser } from '../models/auth/registerUser';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { LoginUser } from '../models/auth/loginUser';
import { TokenResponse } from '../models/auth/tokenResponse';
import {jwtDecode} from 'jwt-decode';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private clientId = 'AdminClient';
  private clientSecret = 'microserviceshopsecret';
  private tokenExpirationTimeout: any;
  private baseUrl = `${environment.identityBaseUri}api/`;
  private tokenUrl = `${environment.identityBaseUri}connect/token`;
  private isLoggedIn = new BehaviorSubject<boolean>(this.isAuthenticated());
  

  constructor(private httpClient: HttpClient) { }

  getIsLoggedIn() {
    return this.isLoggedIn.asObservable();
  }

  register(user: RegisterUser): Observable<RegisterUser> {
    console.log('Kayıt için gönderilen kullanıcı:', user);
    return this.httpClient.post<RegisterUser>(`${this.baseUrl}Users/Register`, user);
  }

  getUserInfo():Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}Users/GetUserInfo`);
  }

  login(loginUser: LoginUser): Observable<any> {
    const url = this.tokenUrl;
    const body = new URLSearchParams({
      grant_type: 'password',
      username: loginUser.userName,
      password: loginUser.password,
      client_id: this.clientId,
      client_secret: this.clientSecret
    }).toString();
    return this.httpClient.post<TokenResponse>(url, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    }).pipe(
      map(response => {
        if (response.access_token) {
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
          localStorage.setItem('expires_in', (response.expires_in).toString());

          // Token süresi sonunda logout yapılacak
          this.scheduleLogout(response.expires_in);
        }
        this.isLoggedIn.next(true);
        return response;
      }),
      catchError(error => {
        console.error('Giriş hatası:', error);
        return of(null);
      })
    );
  }

  getUserIdFromToken(): string | null {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.sub;     
    }
    return null;
  }

  logout() {
    this.clearTokens();
    this.isLoggedIn.next(false);

    if (this.tokenExpirationTimeout) {
      clearTimeout(this.tokenExpirationTimeout);
    }
  }

  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_in');
  }

  isAuthenticated(): boolean {
    const expiresIn = localStorage.getItem('expires_in');
    if (expiresIn) {
      const expiresInTime =new Date().getTime() + parseInt(expiresIn, 10) * 1000;
      return new Date().getTime() < expiresInTime;
    } 
    return false;
  }

  // Token süresi dolduğunda otomatik logout yapılması için zamanlayıcı ayarla
  private scheduleLogout(expiresIn: number) {
    const expiresInMilliseconds = expiresIn * 1000;

    // Eğer eski bir zamanlayıcı varsa, temizle
    if (this.tokenExpirationTimeout) {
      clearTimeout(this.tokenExpirationTimeout);
    }

    // expires_in süresi dolduğunda logout çağır
    this.tokenExpirationTimeout = setTimeout(() => {
      this.logout();
      console.log('Token süresi doldu, otomatik çıkış yapıldı.');
    }, expiresInMilliseconds);
  }
}
