import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss'],
})
export class RecipeCardComponent  implements OnInit {
  // Input: Dışarıdan veri almak için kullanılıyor
  @Input() recipe!: {
    title: string;
    image: string;
    rating: number;
    time: string;
    views: string;
  };
  constructor() { }
  // Output: Favorilere ekleme gibi olaylar için kullanılıyor
  @Output() bookmarkClicked = new EventEmitter<void>();

  // Bookmark ikonuna tıklanıldığında bu fonksiyon tetiklenir
  onBookmark() {
    this.bookmarkClicked.emit();
  }

  ngOnInit() {console.log();}

}
