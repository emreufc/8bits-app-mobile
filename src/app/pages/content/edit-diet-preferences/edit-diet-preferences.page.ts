import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

interface Diet {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-edit-diet-preferences',
  templateUrl: './edit-diet-preferences.page.html',
  styleUrls: ['./edit-diet-preferences.page.scss'],
})
export class EditDietPreferencesPage implements OnInit {
  dietOptions: Diet[] = [
    { id: 'vegetarian', name: 'Vejetaryan', icon: 'assets/icons/leaf.svg' },
    { id: 'vegan', name: 'Vegan', icon: 'seedling' },
    { id: 'keto', name: 'Keto', icon: 'assets/icons/lightning.svg' },
    { id: 'düşük-karbonhidrat', name: 'Düşük Karbonhidrat', icon: 'assets/icons/salad.svg' },
    { id: 'paleo', name: 'Paleo', icon: 'assets/icons/apple.svg' },
    { id: 'none', name: 'Yok', icon: 'assets/icons/utensils.svg' },
  ];

  selectedDiets: Set<string> = new Set();

  constructor(private navCtrl: NavController) {}

  toggleDiet(diet: Diet) {
    if (this.selectedDiets.has(diet.id)) {
      this.selectedDiets.delete(diet.id);
    } else {
      if (diet.id === 'none') {
        this.selectedDiets.clear();
      } else {
        this.selectedDiets.delete('none');
      }
      this.selectedDiets.add(diet.id);
    }
  }

  isDietSelected(dietId: string): boolean {
    return this.selectedDiets.has(dietId);
  }

  next() {
    if (this.selectedDiets.size > 0) {
      const selectedDiets = this.dietOptions.filter(diet => this.selectedDiets.has(diet.id));
      this.navCtrl.navigateForward('/content/allergen-filter', { state: { diets: selectedDiets } });
    } else {
      console.log("Lütfen en az bir diyet seçin.");
    }
  }

  ngOnInit() {}
}
