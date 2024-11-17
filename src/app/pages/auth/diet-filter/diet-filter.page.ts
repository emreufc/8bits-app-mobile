import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

interface Diet {
  id: string;
  name: string;
  icon: string;
  color: string;
  selectedColor: string;
}
@Component({
  selector: 'app-diet-filter',
  templateUrl: './diet-filter.page.html',
  styleUrls: ['./diet-filter.page.scss'],
})
export class DietFilterPage implements OnInit {
  dietOptions: Diet[] = [
    { id: 'vegetarian', name: 'Vejetaryan', icon: 'assets/icons/leaf.svg', color: '#22c55e', selectedColor: '#dcfce7' },
    { id: 'vegan', name: 'Vegan', icon: 'seedling', color: '#eab308', selectedColor: '#fef9c3' },
    { id: 'keto', name: 'Keto', icon: 'assets/icons/lightning.svg', color: '#facc15', selectedColor: '#fef9c3' },
    { id: 'düşük-karbonhidrat', name: 'Düşük Karbonhidrat', icon: 'assets/icons/salad.svg', color: '#4ade80', selectedColor: '#dcfce7' },
    { id: 'paleo', name: 'Paleo', icon: 'assets/icons/apple.svg', color: '#fb923c', selectedColor: '#ffedd5' },
    { id: 'none', name: 'Yok', icon: 'assets/icons/utensils.svg', color: '#9ca3af', selectedColor: '#f3f4f6' },
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

  getDietButtonStyle(diet: Diet): { [key: string]: string } {
    return {
      'background-color': this.isDietSelected(diet.id) ? diet.selectedColor : '#ffffff',
      'border-color': this.isDietSelected(diet.id) ? diet.color : 'transparent',
      'border-width': '2px',
      'border-style': 'solid'
    };
  }

  next() {
    if (this.selectedDiets.size > 0) {
      const selectedDiets = this.dietOptions.filter(diet => this.selectedDiets.has(diet.id));
      this.navCtrl.navigateForward('/auth/allergen-filter', { state: { diets: selectedDiets } });
    } else {
      console.log("Lütfen en az bir diyet seçin.");
    }
  }
 ngOnInit() {
  }

}
