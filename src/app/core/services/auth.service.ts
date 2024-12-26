import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  public async getUser() {
     const user = await lastValueFrom(this.httpClient.get(`${environment.apiUrl}Category`)) as any;

     return {
       ...user,
       profileImage: environment.baseUrl + user.profileImage,
    };
    return { name: 'Emre', surname: 'Aydil'};
  }

}
