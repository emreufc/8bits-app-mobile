import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DietFilterPage } from './diet-filter.page';

const routes: Routes = [
  {
    path: '',
    component: DietFilterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DietFilterPageRoutingModule {}
