import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

interface Ingredient {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-allergen-filter',
  templateUrl: './allergen-filter.page.html',
  styleUrls: ['./allergen-filter.page.scss'],
})
export class AllergenFilterPage implements OnInit {
  ingredients: Ingredient[] = [
    { id: 'dairy', name: 'Süt Ürünleri', icon: 'assets/icons/milk.svg' },
    { id: 'gluten', name: 'Glüten', icon: 'assets/icons/wheat.svg' },
    { id: 'garlic', name: 'Sarımsak', icon: 'assets/icons/garlic.svg' },
    { id: 'onion', name: 'Soğan', icon: 'assets/icons/onion.svg' },
    { id: 'egg', name: 'Yumurta', icon: 'assets/icons/egg.svg' },
    { id: 'soy', name: 'Soya', icon: 'assets/icons/soy.svg' },
    { id: 'fish', name: 'Balık', icon: 'assets/icons/fish.svg' },
    { id: 'seafood', name: 'Deniz Ürünleri', icon: 'assets/icons/shrimp.svg' },
    { id: 'nuts', name: 'Kuruyemiş', icon: 'assets/icons/peanut.svg' },
    { id: 'mushroom', name: 'Mantar', icon: 'assets/icons/mushroom.svg' },
    { id: 'none', name: 'Yok', icon: 'assets/icons/none.svg' },
  ];

  selectedIngredients: Set<string> = new Set();

  constructor(private navCtrl: NavController) {}

  toggleIngredient(ingredient: Ingredient) {
    if (this.selectedIngredients.has(ingredient.id)) {
      this.selectedIngredients.delete(ingredient.id);
    } else {
      if (ingredient.id === 'none') {
        this.selectedIngredients.clear();
      } else {
        this.selectedIngredients.delete('none');
      }
      this.selectedIngredients.add(ingredient.id);
    }
  }

  isIngredientSelected(ingredientId: string): boolean {
    return this.selectedIngredients.has(ingredientId);
  }

  confirm() {
    if (this.selectedIngredients.size > 0) {
      const selectedIngredients = this.ingredients.filter(ingredient =>
        this.selectedIngredients.has(ingredient.id)
      );
      this.navCtrl.navigateForward('/content/home', {
        state: { ingredients: selectedIngredients },
      });
    }
  }

  ngOnInit() {}
}
