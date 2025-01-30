import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngredientService } from '../core/services/ingredient.service';
import { ShopListPageModule } from '../pages/content/shop-list/shop-list.module';
import { AuthService } from '../core/services/auth.service';
import { ShopListService } from '../core/services/shop-list.service';



@NgModule({
  declarations: [],
  providers: [IngredientService, ShopListService, AuthService],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
