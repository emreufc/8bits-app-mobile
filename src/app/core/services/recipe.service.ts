import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
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
    return lastValueFrom(this.httpClient.get(`${environment.apiUrl}Recipe/GetFavouriteRecipes/1/100`)) as any;
  }

  async favRecipe(status: boolean, recipeId: number) {
    const uid = this.authService.getUid();
    if (status) {
      return lastValueFrom(this.httpClient.post(`${environment.apiUrl}Recipe/AddFavouriteRecipe`, {
        userId: uid,
        recipeId: recipeId,
      }));
    } else {
      return lastValueFrom(
        this.httpClient.delete(`${environment.apiUrl}Recipe/RemoveFavouriteRecipe/${recipeId}/${uid}`)
      );
    }
  }
}
