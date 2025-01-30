import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { CategoryComponent } from './category/category.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { RecipeCardComponent } from './recipe-card/recipe-card.component';
import { DetailsIngredientComponent } from './details-ingredient/details-ingredient.component';
import { AddItemComponent } from './add-item/add-item.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HeaderComponent,
    CategoryComponent,
    SearchbarComponent,
    RecipeCardComponent,
    DetailsIngredientComponent,
    AddItemComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    HeaderComponent,
    CategoryComponent,
    SearchbarComponent,
    RecipeCardComponent,
    DetailsIngredientComponent,
    AddItemComponent
  ]
})
export class ComponentsModule { }
