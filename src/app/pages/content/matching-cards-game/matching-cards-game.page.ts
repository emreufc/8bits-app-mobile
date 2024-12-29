import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { GameService } from 'src/app/core/services/game.service';

@Component({
  selector: 'app-matching-cards-game',
  templateUrl: './matching-cards-game.page.html',
  styleUrls: ['./matching-cards-game.page.scss'],
})
export class MatchingCardsGamePage implements OnInit {
  cardsArray: any[] = [];
  timeRemaining: number = 100;
  flips: number = 0;
  cardToCheck: any = null;
  matchedCards: any[] = [];
  busy: boolean = false;
  countdown: any;
  gameOver: boolean = false;
  victory: boolean = false;
  gameStarted: boolean = false;

  constructor(
    public alertController: AlertController,
    private gameService: GameService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cardsArray = this.initializeCards();
  }

  startGame() {
    this.gameStarted = true;
    this.timeRemaining = 100000; 
    this.flips = 0;
    this.cardToCheck = null;
    this.matchedCards = [];
    this.busy = true;  
    this.gameOver = false;
    this.victory = false;
    this.shuffleCards(this.cardsArray);
    this.cardsArray.forEach(card => card.visible = false);
    setTimeout(() => {
      this.cardsArray.forEach(card => card.visible = true);
    }, 1000);
    setTimeout(() => {
      this.hideCards();  
      this.countdown = this.startCountdown();  
      this.busy = false;  
    }, 6000);  
  }
  

  startCountdown() {
    return setInterval(() => {
      this.timeRemaining -= 100;
      if (this.timeRemaining <= 0) {
        this.timeRemaining = 0;
        this.handleGameOver();
      }
    }, 100);
  }

  handleGameOver() {
    clearInterval(this.countdown);
    this.gameOver = true;
    this.gameService.saveRecord(0, this.flips, false);
  }

  navigateHome() {
    this.router.navigate(['/content/home']);
  }


  handleVictory() {
    this.victory = true;
    clearInterval(this.countdown);
    this.gameService.saveRecord(this.timeRemaining, this.flips, true);
  }

  hideCards() {
    this.cardsArray.forEach((card) => {
      card.visible = false;
      card.matched = false;
    });
  }

  flipCard(card: any) {
    if (this.canFlipCard(card)) {
      this.flips++;
      card.visible = true;
      if (this.cardToCheck) {
        this.checkForCardMatch(card);
      } else {
        this.cardToCheck = card;
      }
    }
  }

  checkForCardMatch(card: any) {
    if (this.cardToCheck.icon === card.icon) {
      this.handleCardMatch(card, this.cardToCheck);
    } else {
      this.handleCardMismatch(card, this.cardToCheck);
    }
    this.cardToCheck = null;
  }

  handleCardMatch(card1: any, card2: any) {
    card1.matched = true;
    card2.matched = true;
    this.matchedCards.push(card1, card2);
    if (this.matchedCards.length === this.cardsArray.length) {
      this.handleVictory();
    }
  }

  handleCardMismatch(card1: any, card2: any) {
    this.busy = true;
    setTimeout(() => {
      card1.visible = false;
      card2.visible = false;
      this.busy = false;
    }, 1000);
  }

  shuffleCards(cards: any[]) {
    for (let i = cards.length - 1; i > 0; i--) {
      const randIndex = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[randIndex]] = [cards[randIndex], cards[i]];
    }
  }

  canFlipCard(card: any) {
    return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
  }

  resetGame() {
    this.gameStarted = false;
    this.timeRemaining = 100;
    this.flips = 0;
    this.cardToCheck = null;
    this.matchedCards = [];
    this.busy = false;
    this.gameOver = false;
    this.victory = false;
    this.cardsArray = this.initializeCards(); 
    clearInterval(this.countdown); 
  }

  initializeCards() {
    return [
      { icon: 'pizza-outline', visible: false, matched: false },
      { icon: 'pizza-outline', visible: false, matched: false },
      { icon: 'fast-food-outline', visible: false, matched: false },
      { icon: 'fast-food-outline', visible: false, matched: false },
      { icon: 'ice-cream-outline', visible: false, matched: false },
      { icon: 'ice-cream-outline', visible: false, matched: false },
      { icon: 'restaurant-outline', visible: false, matched: false },
      { icon: 'restaurant-outline', visible: false, matched: false },
      { icon: 'wine-outline', visible: false, matched: false },
      { icon: 'wine-outline', visible: false, matched: false },
      { icon: 'beer-outline', visible: false, matched: false },
      { icon: 'beer-outline', visible: false, matched: false },
      { icon: 'cafe-outline', visible: false, matched: false },
      { icon: 'cafe-outline', visible: false, matched: false },
      { icon: 'nutrition-outline', visible: false, matched: false },
      { icon: 'nutrition-outline', visible: false, matched: false },
    ];
  }
  
}