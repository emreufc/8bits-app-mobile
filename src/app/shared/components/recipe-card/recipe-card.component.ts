import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss'],
})
export class RecipeCardComponent  implements OnInit {
  isLiked: boolean = false; // Varsayılan olarak içi boş kalp

  // Input: Dışarıdan veri almak için kullanılıyor
  @Input() recipe!: {
    title: string;
    image: string;
    rating: number;
    time: string;
    views: string;
    isLiked: boolean;
  };
  constructor() { }


    // Kalp durumunu değiştirir
    toggleLike() {
      this.isLiked = !this.isLiked;
      console.log('Kalp durumu:', this.isLiked ? 'Beğenildi' : 'Beğenilmedi');
    }

  ngOnInit() {console.log();}

}
