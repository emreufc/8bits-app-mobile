import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { OldRecipe } from '../models/recipe';

@Injectable()
export class RecipeService {
  
  constructor(private httpClient: HttpClient, private authService: AuthService) {
  }

  getRecipeDetail(id: number) {
    return lastValueFrom(this.httpClient.get(`${environment.apiUrl}Recipes/${id}`));
  }

  getRecipeIngredients(id: number) {
    return lastValueFrom(this.httpClient.get(`${environment.apiUrl}RecipeIngredient/recipe/${id}`));
  }

  getRecipeSteps(id: number) {
    return lastValueFrom(this.httpClient.get(`${environment.apiUrl}RecipeStep/steps/recipe/${id}`));
  }

  toggleOldRecipeStatus(oldRecipe: OldRecipe) {
    return lastValueFrom(this.httpClient.post(`${environment.apiUrl}OldRecipe/ToggleOldRecipe`, oldRecipe));
  }

  getFavRecipes() {
    return lastValueFrom(this.httpClient.get(`${environment.apiUrl}FavoriteRecipes/user-favorites`)) as any;
  }

  checkIngredients(recipeId: number): Promise<any> {
    return lastValueFrom(
      this.httpClient.get(`${environment.apiUrl}userInventory/check-inventory/${recipeId}`)
    );
  }
  
  deductIngredients(recipeId: number): Promise<any> {
    return lastValueFrom(
      this.httpClient.post(`${environment.apiUrl}userInventory/deduct-ingredient`, {recipeId})
    );
  }
  
  addToShoppingCart(shoppingListRequest: any): Promise<any> {
    return lastValueFrom(
      this.httpClient.post(`${environment.apiUrl}ShoppingList/add`, shoppingListRequest)
    );
  }

  async favRecipe(status: boolean, recipeId: number) {
    if (status) {
      return lastValueFrom(this.httpClient.post(`${environment.apiUrl}FavoriteRecipes/add`, {
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

  getMatchedRecipes(pageNumber: number = 1, pageSize: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.httpClient.get(`${environment.apiUrl}Recipes/recipes-with-match`, { params });
  }

  getSearchedRecipes(keyword: string, pageNumber: number = 1, pageSize: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    return this.httpClient.get(`${environment.apiUrl}Recipes/keyword`, { params });
  }

  getFilteredRecipes(categories: string, pageNumber: number = 1, pageSize: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('categories', categories)
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.httpClient.get(`${environment.apiUrl}Recipes/filtered`, { params });
  }
}
