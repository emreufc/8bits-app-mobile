import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllergenFilterPageRoutingModule } from './allergen-filter-routing.module';

import { AllergenFilterPage } from './allergen-filter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllergenFilterPageRoutingModule
  ],
  declarations: [AllergenFilterPage]
})
export class AllergenFilterPageModule {}
