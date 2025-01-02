// ingredient.service.ts

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ingredient } from 'src/app/core/models/ingredient';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  constructor(private http: HttpClient) {}

  getIngredients(pageNumber: number = 1, pageSize: number = 10): Observable<any> {
    // HttpParams ile pageNumber ve pageSize ayarlanıyor
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    // API endpoint: Örnek "/Ingredients"
    return this.http.get(`${environment.apiUrl}Ingredients`, { params });
  }
  
  getIngredientById(ingredientId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}Ingredients/${ingredientId}`);
  }
}
