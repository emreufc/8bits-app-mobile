import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public async getUser() {
    // const user = await lastValueFrom(this.httpClient.get(`${environment.apiUrl}Profile/GetCurrentUser`)) as any;

    // return {
    //   ...user,
    //   profileImage: environment.baseUrl + user.profileImage,
    //  };
    return { name: 'Emre', surname: 'Aydil'};
  }

  public async register(userData: any) {

    const response = await lastValueFrom(this.http.post(`${environment.apiUrl}Auth/Register`, userData));
    //return response;

    return { success: true, message: 'User registered successfully' };
  }

}
