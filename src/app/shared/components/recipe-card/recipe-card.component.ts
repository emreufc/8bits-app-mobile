import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss'],
})
export class RecipeCardComponent  implements OnInit {
  // Input: Dışarıdan veri almak için kullanılıyor
  @Input() recipe!: {
    id: number;
    title: string;
    image: string;
    rating: number;
    time: string;
    views: string;
    isLiked: boolean;
  };
  @Output() likeToggled = new EventEmitter<number>(); // Parent'a bildirim yapmak için EventEmitter

  constructor() { }


  ngOnInit() {console.log("tetiklendi");}


  toggleLike(event : Event) {
    event.stopPropagation();
    this.likeToggled.emit(this.recipe.id); // Parent'a tarifin ID'sini bildir
    console.log(`${this.recipe.title} beğenme durumu güncellendi.`);
  }


}
