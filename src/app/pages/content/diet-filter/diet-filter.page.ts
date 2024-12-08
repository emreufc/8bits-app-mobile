import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

interface Diet {
  id: string;
  name: string;
  icon: string;
}
@Component({
  selector: 'app-diet-filter',
  templateUrl: './diet-filter.page.html',
  styleUrls: ['./diet-filter.page.scss'],
})
export class DietFilterPage implements OnInit {
  dietOptions: Diet[] = [// grupları belirledim renkleri farklı yaptım ama bunu değiştirebiliriz
    { id: 'vegetarian', name: 'Vejetaryan', icon: 'assets/icons/leaf.svg' },
    { id: 'vegan', name: 'Vegan', icon: 'seedling' },
    { id: 'keto', name: 'Keto', icon: 'assets/icons/lightning.svg' },
    { id: 'düşük-karbonhidrat', name: 'Düşük Karbonhidrat', icon: 'assets/icons/salad.svg'},
    { id: 'paleo', name: 'Paleo', icon: 'assets/icons/apple.svg' },
    { id: 'none', name: 'Yok', icon: 'assets/icons/utensils.svg' },
  ];

  selectedDiets: Set<string> = new Set();

  constructor(private navCtrl: NavController) {}
  
  toggleDiet(diet: Diet) {
    if (this.selectedDiets.has(diet.id)) {
      this.selectedDiets.delete(diet.id);
    } else {
      if (diet.id === 'none') {// none basılınca 
        this.selectedDiets.clear(); // diğer seçenekleri sıfırla
      } else {
        this.selectedDiets.delete('none'); // başka bir şey seçildiyse none kaldır
      }
      this.selectedDiets.add(diet.id);
    }
  }

  isDietSelected(dietId: string): boolean {
    return this.selectedDiets.has(dietId);
  }

  getDietButtonStyle(diet: Diet): { [key: string]: string } {// basıldıktan sonra kutunun rengi değişsin diye yazıldı
    return {
      'background-color': this.isDietSelected(diet.id) ? '#fff7ed' : '#ffffff',
      'border-color': this.isDietSelected(diet.id) ? '#f97316' : 'transparent',
      'border-width': '2px',
      'border-style': 'solid'
    };
  }

  next() {
    if (this.selectedDiets.size > 0) {//sonraki butonu için seçili diet yoksa ilerletmiyor
      const selectedDiets = this.dietOptions.filter(diet => this.selectedDiets.has(diet.id));
      this.navCtrl.navigateForward('/content/allergen-filter', { state: { diets: selectedDiets } });// bir sonraki sayfaya yönlendirdi
    } else {
      console.log("Lütfen en az bir diyet seçin.");
    }
  }
 ngOnInit() {
  }

}
