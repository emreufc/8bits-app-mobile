import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddnewitemPageRoutingModule } from './addnewitem-routing.module';

import { AddnewitemPage } from './addnewitem.page';

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
