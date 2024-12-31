import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopListPageRoutingModule } from './shop-list-routing.module';

import { ShopListPage } from './shop-list.page';
import { IngredientService } from 'src/app/core/services/ingredient.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopListPageRoutingModule
  ],
  declarations: [ShopListPage],
  providers: [IngredientService]
})
export class ShopListPageModule {}
