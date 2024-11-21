import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { CategoryComponent } from './category/category.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { RecipeCardComponent } from './recipe-card/recipe-card.component';

@NgModule({
  declarations: [
    HeaderComponent,
    CategoryComponent,
    SearchbarComponent,
    RecipeCardComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
  ],
  exports: [
    HeaderComponent,
    CategoryComponent,
    SearchbarComponent,
    RecipeCardComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule { }
