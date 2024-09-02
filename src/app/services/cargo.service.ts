import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { map, Observable } from 'rxjs';
import { CargoCompany } from '../models/cargo/cargoCompany';

@Injectable({
  providedIn: 'root'
})
export class CargoService {

  constructor(private httpClient: HttpClient) { }

  private baseUrl = `${environment.gatewayBaseUri}/${environment.cargoPath}`;


  getCargoCompanies(): Observable<CargoCompany[]> {
    return this.httpClient.get<{ data: CargoCompany[] }>(`${this.baseUrl}CargoCompanies`)
      .pipe(
        map(response => {
          return response.data;
        })
      );
}
}
