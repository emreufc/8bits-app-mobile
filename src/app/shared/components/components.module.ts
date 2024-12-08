import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { CategoryComponent } from './category/category.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { RecipeCardComponent } from './recipe-card/recipe-card.component';
import { DetailsIngredientComponent } from './details-ingredient/details-ingredient.component';



@NgModule({
  declarations: [
    HeaderComponent,
    CategoryComponent,
    SearchbarComponent,
    RecipeCardComponent,
    DetailsIngredientComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    CategoryComponent,
    SearchbarComponent,
    RecipeCardComponent,
    DetailsIngredientComponent
  ]
})
export class ComponentsModule { }
