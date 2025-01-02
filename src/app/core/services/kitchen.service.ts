import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KitchenService {

  constructor(private httpClient: HttpClient,

  ) { }

  getKitchenList(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}UserInventory/myInventory`);
  }

  addKitchenItem(item: { ingredientId: number; quantityTypeId: number; quantity: number }): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}UserInventory/add`, item);
  }

  deleteKitchenItem(id: number): Observable<any> {
    return this.httpClient.delete(`${environment.apiUrl}UserInventory/${id}`);
  }

  updateKitchenItem(ingredientId: number, quantityTypeId: number, quantity: number): Observable<any> {
    const payload = {
      ingredientId,
      quantityTypeId,
      quantity
    };
    return this.httpClient.put(`${environment.apiUrl}UserInventory/update`, payload);
  }
}

