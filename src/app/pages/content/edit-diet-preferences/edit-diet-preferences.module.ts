import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDietPreferencesPageRoutingModule } from './edit-diet-preferences-routing.module';

import { EditDietPreferencesPage } from './edit-diet-preferences.page';
import { ComponentsModule } from 'src/app/shared/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditDietPreferencesPageRoutingModule,
    ComponentsModule
  ],
  declarations: [EditDietPreferencesPage]
})
export class EditDietPreferencesPageModule {}
