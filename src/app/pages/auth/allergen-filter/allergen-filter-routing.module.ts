import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllergenFilterPage } from './allergen-filter.page';

const routes: Routes = [
  {
    path: '',
    component: AllergenFilterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllergenFilterPageRoutingModule {}
