import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterUser } from '../models/auth/registerUser';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { LoginUser } from '../models/auth/loginUser';
import { TokenResponse } from '../models/auth/tokenResponse';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  path = "http://localhost:5001/api/";
  tokenUrl = 'http://localhost:5001/connect/token';
  private clientId = 'AdminClient';
  private clientSecret = 'microserviceshopsecret';

  constructor(private httpClient: HttpClient) { }
  
  private isLoggedIn = new BehaviorSubject<boolean>(this.isAuthenticated());

  // Kullanıcının giriş durumunu almak için
  getIsLoggedIn() {
    return this.isLoggedIn.asObservable();
  }


  register(user: RegisterUser): Observable<RegisterUser> {
    return this.httpClient.post<RegisterUser>(this.path + "Users/Register", user)
  }

  getUserInfo():Observable<any> {
    return this.httpClient.get<any>(this.path + "Users/GetUserInfo")
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
}
