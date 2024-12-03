import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddnewitemPageRoutingModule } from './AddNewItemPage-routing.module';

import { AddnewitemPage } from './AddNewItemPage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddnewitemPageRoutingModule
  ],
  declarations: [AddnewitemPage]
})
export class AddnewitemPageModule {}
