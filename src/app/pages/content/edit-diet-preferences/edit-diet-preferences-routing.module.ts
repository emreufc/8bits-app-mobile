import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditDietPreferencesPage } from './edit-diet-preferences.page';

const routes: Routes = [
  {
    path: '',
    component: EditDietPreferencesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditDietPreferencesPageRoutingModule {}
