import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ingredient } from '../models/ingredient';

@Injectable({
  providedIn: 'root'
})
export class ShopListService {

  constructor(private http: HttpClient) { }

  // Malzeme ekleme servisi
  addToList(payload: { ingredientId: number; quantityTypeId: number; quantity: number }): Observable<any> {
    const apiUrl = `${environment.apiUrl}ShoppingList/add`;
    return this.http.post(apiUrl, payload);
  }
  
  
}
