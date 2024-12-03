import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddnewitemPage } from './addnewitem.page';

const routes: Routes = [
  {
    path: '',
    component: AddnewitemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddnewitemPageRoutingModule {}
