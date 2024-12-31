import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngredientService } from '../core/services/ingredient.service';
import { ShopListPageModule } from '../pages/content/shop-list/shop-list.module';



@NgModule({
  declarations: [],
  providers: [IngredientService, ShopListPageModule],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
