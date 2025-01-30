import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatchingCardsGamePageRoutingModule } from './matching-cards-game-routing.module';

import { MatchingCardsGamePage } from './matching-cards-game.page';
import { GameService } from 'src/app/core/services/game.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicModule,
    MatchingCardsGamePageRoutingModule
  ],
  providers: [GameService],
  declarations: [MatchingCardsGamePage]
})
export class MatchingCardsGamePageModule {}
