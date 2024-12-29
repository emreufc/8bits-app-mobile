import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private UID_KEY = 'uid';
  constructor(private http: HttpClient) { }

  public async getUser() {
    // const user = await lastValueFrom(this.httpClient.get(`${environment.apiUrl}Profile/GetCurrentUser`)) as any;

    // return {
    //   ...user,
    //   profileImage: environment.baseUrl + user.profileImage,
    //  };
    return { name: 'Emre', surname: 'Aydil'};
  }

  getUid(): number | null {
    return Number(localStorage.getItem(this.UID_KEY));
  }

  public async register(userData: any) {
    // Bu lastValueFrom bişiler bişiler ama araştırınca kontrol etcem belki kaldırırız. Ne sikim olduğunu bilmiyorum.
    const response = await lastValueFrom(this.http.post(`${environment.apiUrl}Auth/Register`, userData));
    //return response;

    return { success: true, message: 'User registered successfully' };
  }

  login(loginData: { email: string, password: string }): Observable<any> {
    const endpoint = `${environment.apiUrl}Auth/login`;
    return this.http.post<any>(endpoint, loginData);
  }

}
