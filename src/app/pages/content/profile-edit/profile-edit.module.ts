import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileEditPageRoutingModule } from './profile-edit-routing.module';

import { ProfileEditPage } from './profile-edit.page';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { UserService } from 'src/app/core/services/user.service';
import { HttpClient } from '@angular/common/http';
import { DietPreferenceService } from 'src/app/core/services/diet-preference.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileEditPageRoutingModule
  ],
  declarations: [ProfileEditPage],
  providers: [UserService, DietPreferenceService]
})
export class ProfileEditPageModule {}
