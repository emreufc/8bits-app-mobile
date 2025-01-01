import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RecipeService } from 'src/app/core/services/recipe.service';
import { RecipeSummary } from 'src/app/core/models/recipe';
@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss'],
})
export class RecipeCardComponent  implements OnInit {
  // Input: Dışarıdan veri almak için kullanılıyor
  @Input() recipe!: RecipeSummary;
  @Output() likeToggled = new EventEmitter<number>(); // Parent'a bildirim yapmak için EventEmitter

  constructor() { }


  ngOnInit() {console.log("Card Component'i tetiklendi");}


  toggleLike(event : Event) {
    event.stopPropagation();
    this.likeToggled.emit(this.recipe.recipeId); // Parent'a tarifin ID'sini bildir
    console.log(`${this.recipe.recipeName} beğenme durumu güncellendi.`);
  }


}
