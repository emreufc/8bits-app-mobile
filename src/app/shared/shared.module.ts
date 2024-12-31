import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngredientService } from '../core/services/ingredient.service';



@NgModule({
  declarations: [],
  providers: [IngredientService],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
