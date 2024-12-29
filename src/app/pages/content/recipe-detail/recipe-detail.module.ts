import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeDetailComponent } from './recipe-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RecipeService } from 'src/app/core/services/recipe.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: RecipeDetailComponent
  }
];

@NgModule({
  declarations: [RecipeDetailComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    RecipeService,
    AuthService
  ],
  exports: [RecipeDetailComponent]
})
export class RecipeDetailModule { }
