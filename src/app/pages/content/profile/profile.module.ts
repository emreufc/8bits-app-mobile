import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { RecipeService } from 'src/app/core/services/recipe.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    ComponentsModule
  ],
  declarations: [ProfilePage],
  providers: [RecipeService]
})
export class ProfilePageModule {}
