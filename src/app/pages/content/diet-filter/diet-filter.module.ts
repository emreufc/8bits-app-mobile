import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DietFilterPageRoutingModule } from './diet-filter-routing.module';

import { DietFilterPage } from './diet-filter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DietFilterPageRoutingModule
  ],
  declarations: [DietFilterPage]
})
export class DietFilterPageModule {}
