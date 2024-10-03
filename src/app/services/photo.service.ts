import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { PhotoResponse } from '../models/photoStock/photoResponse';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  private baseUrl = `${environment.gatewayBaseUri}/${environment.photoPath}`;

  constructor(private httpClient: HttpClient) { }

  uploadPhoto(file: File): Observable<PhotoResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.httpClient.post<PhotoResponse>(`${this.baseUrl}Photos/upload`, formData);
  }


  uploadPhotos(files: File[]): Observable<PhotoResponse[]> {
    const formData = new FormData();
     files.forEach(file => {
       formData.append('files', file);
     });
    return this.httpClient.post<PhotoResponse[]>(`${this.baseUrl}Photos/upload-multiple`, formData);
  }

}
