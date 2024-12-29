import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) { }

  saveRecord(remainingTime: number, numberOfFlip: number, isCompleted: boolean) {
    const userId = this.authService.getUid();
    
    return lastValueFrom(this.httpClient.post(`${environment.apiUrl}Game/SaveRecord`, {
      userId: userId,
      remainingTime: remainingTime,
      numberOfFlip: numberOfFlip,
      isCompleted: isCompleted
    }));
  }

  getLeaderboard(month: number, year: number, pageNumber: number = 1, pageSize: number = 25) {
    return lastValueFrom(this.httpClient.get(`${environment.apiUrl}Game/GetLeaderboard/${month}/${year}/${pageNumber}/${pageSize}`));
  }
}
