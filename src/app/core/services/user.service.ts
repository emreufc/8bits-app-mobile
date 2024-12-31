import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getCurrentUser() {
    const response = `${environment.apiUrl}Users/current`;
    return this.http.get<any>(response);
  }
  editProfile() {
    const response = `${environment.apiUrl}Users/Update`;
    return this.http.put<any>(response, {});
  }
}
