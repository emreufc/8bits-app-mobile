import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class RecipeService {
  
  constructor(private httpClient: HttpClient, private authService: AuthService) {
  }

  getRecipeDetail(id: number) {
    return lastValueFrom(this.httpClient.get(`${environment.apiUrl}Recipe/GetRecipeById/${id}`));
  }

  getFavRecipes() {
    return lastValueFrom(this.httpClient.get(`${environment.apiUrl}FavoriteRecipes/user-favorites`)) as any;
  }

  async favRecipe(status: boolean, recipeId: number) {
    const uid = this.authService.getUid();
    if (status) {
      return lastValueFrom(this.httpClient.post(`${environment.apiUrl}FavoriteRecipes/add`, {
        // userId: uid,
        recipeId: recipeId,
      }));
    } else {
      return lastValueFrom(
        this.httpClient.delete(`${environment.apiUrl}FavoriteRecipes/remove`, {
          params: new HttpParams().set('recipeId', recipeId.toString())
        })
      );
    }
  }

  getRecipes(pageNumber: number = 1, pageSize: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.httpClient.get(`${environment.apiUrl}Recipes`, { params });
  }

}
