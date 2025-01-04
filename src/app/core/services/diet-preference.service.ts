import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class DietPreferenceService {
  constructor(private httpClient: HttpClient) { }

  getDietTypes(pageNumber: number = 1, pageSize: number = 10): Observable<any> {
    // HttpParams ile pageNumber ve pageSize ayarlanıyor
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    // API endpoint: Örnek "/Ingredients"
    return this.httpClient.get(`${environment.apiUrl}DietType`, { params });
  }

  
}
