import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatchingCardsGamePage } from './matching-cards-game.page';

const routes: Routes = [
  {
    path: '',
    component: MatchingCardsGamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchingCardsGamePageRoutingModule {}
