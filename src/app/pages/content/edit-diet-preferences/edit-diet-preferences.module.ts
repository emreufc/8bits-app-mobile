import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDietPreferencesPageRoutingModule } from './edit-diet-preferences-routing.module';

import { EditDietPreferencesPage } from './edit-diet-preferences.page';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { DietPreferenceService } from 'src/app/core/services/diet-preference.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditDietPreferencesPageRoutingModule,
    ComponentsModule
  ],
  providers: [DietPreferenceService], // Servisi burada da ekleyin
  declarations: [EditDietPreferencesPage]
})
export class EditDietPreferencesPageModule {}
