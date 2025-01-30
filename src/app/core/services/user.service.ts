import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getCurrentUser() {
    const response = `${environment.apiUrl}Users/current`;
    return this.http.get<any>(response);
  }
  editProfile(updatedUserData: any) {
    const apiUrl = `${environment.apiUrl}Users/Update`;
    return this.http.put<any>(apiUrl, updatedUserData); // Body içinde veriyi gönderiyoruz
  }

  uploadProfileImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('profileImage', file);
  
    return this.http.post('/api/users/upload-profile-image', formData);
  }
}
