import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterUser } from '../models/registerUser';
import { catchError, map, Observable, of } from 'rxjs';
import { LoginUser } from '../models/loginUser';
import { TokenResponse } from '../models/tokenResponse';
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

  // private clearTokens() {
  //   localStorage.removeItem('access_token');
  //   localStorage.removeItem('refresh_token');
  //   localStorage.removeItem('expires_at');
  // }

  // isAuthenticated(): boolean {
  //   const expiresAt = localStorage.getItem('expires_at');
    
  //   if (expiresAt) {
  //     const expiresAtTime = parseInt(expiresAt, 10);
  //     return new Date().getTime() < expiresAtTime;
  //   }
    
  //   return false;
  // }
}
