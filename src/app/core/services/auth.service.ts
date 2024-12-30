import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, lastValueFrom, of, tap } from 'rxjs';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user';
import {
  FacebookLogin,
  FacebookLoginResponse
} from '@capacitor-community/facebook-login';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private UID_KEY = 'uid';
  private ACCESS_KEY = 'access-token';
  private REFRESH_KEY = 'refresh-token';
  private EXPIRATION_KEY = 'expiration';
  private isImageChanged = new BehaviorSubject<File | undefined>(undefined);
  currentImage = this.isImageChanged.asObservable();

  private jwtHelper = new JwtHelperService();

  constructor(private httpClient: HttpClient) { }

  public async getUser(): Promise<User> {
    const user = await lastValueFrom(this.httpClient.get(`${environment.apiUrl}Profile/GetCurrentUser`)) as any;

    return {
      ...user,
      profileImage: environment.apiUrl + user.profileImage,
    };
  }

  getUid(): number | null {
    return Number(localStorage.getItem(this.UID_KEY));
  }

  getToken(): string | null {
    return localStorage.getItem(this.ACCESS_KEY);
  }

  getExpiration(): string | null {
    return localStorage.getItem(this.EXPIRATION_KEY);
  }

  register(credentials: User): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}Auth/register`, credentials)
      .pipe(
        tap((response: any) => {
          if (response.accessToken) {
            localStorage.setItem(this.ACCESS_KEY, response.accessToken);
            localStorage.setItem(this.REFRESH_KEY, response.refreshToken);
            localStorage.setItem(this.UID_KEY, response.uid);
            localStorage.setItem(this.EXPIRATION_KEY, response.expiration);
          }
          return 200;
        }),
      );
  }

  login(credentials: { email: string, password: string }) {
    return this.httpClient.post(`${environment.apiUrl}Auth/login`, credentials)
      .pipe(
        tap((response: any) => {
          if (response.accessToken) {
            localStorage.setItem(this.ACCESS_KEY, response.accessToken);
            localStorage.setItem(this.REFRESH_KEY, response.refreshToken);
            localStorage.setItem(this.UID_KEY, response.uid);
            localStorage.setItem(this.EXPIRATION_KEY, response.expiration);
          }

          return 200;
        }),
      );
  }

  async isAuthenticated(): Promise<boolean> {
    const token = localStorage.getItem(this.ACCESS_KEY);

    if (!token) {
      return false;
    }

    let isTokenExpired = this.jwtHelper.isTokenExpired(token);

    if (isTokenExpired) {
      const refreshResult = await this.setRefreshToken();
      if (refreshResult) {
        isTokenExpired = false;
      }
    }

    return !isTokenExpired;
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  updateProfile(fields: any) {
    const token = this.getToken();
    return lastValueFrom(this.httpClient.put(`${environment.apiUrl}Profile/UpdateUser`, fields));
  }

  updateProfileImage(image: File) {
    const token = this.getToken();
    const formData: FormData = new FormData();
    formData.append('profileImage', image);
    this.isImageChanged.next(image);

    return lastValueFrom(this.httpClient.post(`${environment.apiUrl}Profile/UploadProfileImage`, formData));
  }

  changePassword(password: string, newPassword: string) {
    const token = this.getToken();
    return lastValueFrom(this.httpClient.post(`${environment.apiUrl}Auth/ChangePassword`, {
      oldPassword: password,
      newPassword: newPassword
    }));
  }

  async setRefreshToken() {
    try {
      const response: any = await lastValueFrom(this.httpClient.post(`${environment.apiUrl}auth/refresh`, {
        accessToken: this.getToken(),
        refreshToken: this.getRefreshToken(),
        uid: this.getUid(),
        expiration: this.getExpiration(),
      }));

      if (response.accessToken) {
        localStorage.setItem(this.ACCESS_KEY, response.accessToken);
        localStorage.setItem(this.REFRESH_KEY, response.refreshToken);
        localStorage.setItem(this.UID_KEY, response.uid);
        localStorage.setItem(this.EXPIRATION_KEY, response.expiration);
      }

      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem(this.ACCESS_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
  }

  async loginWithGoogle() {
    const result = await GoogleAuth.signIn();

    return new Promise((resolve) => {
      return this.httpClient.post(`${environment.apiUrl}Auth/google`, {
        GivenName: result.givenName,
        FamilyName: result.familyName,
        Email: result.email,
        ImageUrl: result.imageUrl,
        IdToken: result.authentication.idToken,
        Id: result.id,
      }).pipe(
        tap((response: any) => {
          if (response.token) {
            localStorage.setItem(this.ACCESS_KEY, response.token.accessToken);
            localStorage.setItem(this.REFRESH_KEY, response.token.refreshToken);
            localStorage.setItem(this.UID_KEY, response.token.uid);
            localStorage.setItem(this.EXPIRATION_KEY, response.token.expiration);
          }

          return resolve({ status: true, isNewUser: response.isNewUser });
        }),
      ).subscribe();
    });
  }

  async loginWithFacebook() {
    try {
      const FACEBOOK_PERMISSIONS = ['email', 'public_profile'];
      const facebookLoginResponse: FacebookLoginResponse = await FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });

      if (facebookLoginResponse && facebookLoginResponse.accessToken) {
        const accessToken = facebookLoginResponse.accessToken.token;

        const facebookProfile = await FacebookLogin.getProfile<{ email: string, id: string, name: string }>({ fields: ['email', 'id', 'name'] });
        console.log("facebook profile", facebookProfile);
        if (facebookProfile && facebookProfile.email) {
          return new Promise((resolve, reject) => {
            return this.httpClient.post(`${environment.apiUrl}Auth/facebook`, {
              Email: facebookProfile.email,
              FacebookId: facebookProfile.id,
              Name: facebookProfile.name,
              AccessToken: accessToken,
            }).pipe(
              tap((response: any) => {
                if (response.token) {
                  localStorage.setItem(this.ACCESS_KEY, response.token.accessToken);
                  localStorage.setItem(this.REFRESH_KEY, response.token.refreshToken);
                  localStorage.setItem(this.UID_KEY, response.token.uid);
                  localStorage.setItem(this.EXPIRATION_KEY, response.token.expiration);
                }

                return resolve({ status: true, isNewUser: response.isNewUser });
              }),
              catchError((error) => {
                console.error('Error in Facebook login response', error);
                reject(null);
                return of(null);
              })
            ).subscribe();
          });
        }
      }
    } catch (error) {
      console.error('Facebook login failed', error);
      throw new Error('Facebook login failed');
    }
    return null;
  }

}
