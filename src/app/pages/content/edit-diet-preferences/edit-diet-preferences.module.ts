import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDietPreferencesPageRoutingModule } from './edit-diet-preferences-routing.module';

import { EditDietPreferencesPage } from './edit-diet-preferences.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditDietPreferencesPageRoutingModule
  ],
  declarations: [EditDietPreferencesPage]
})
export class EditDietPreferencesPageModule {}
