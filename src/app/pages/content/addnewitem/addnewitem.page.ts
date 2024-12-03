import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-add-new-item',
  templateUrl: './addnewitem.page.html',
  styleUrls: ['./addnewitem.page.scss'],
})
export class AddnewitemPage {
  itemName: string = '';
  quantity: number | null = null;
  unit: string = ''; // Seçilen ölçüm birimi

  constructor(private navCtrl: NavController) {}

  addNewItem() {
    if (this.itemName && this.quantity && this.unit) {
      const newItem = {
        id: Date.now(), //unique id
        name: this.itemName,
        quantity: this.quantity,
        unit: this.unit,
      };
      
      // Yeni öğeyi query parametreleri ile ShopListPage'e gönder
      this.navCtrl.navigateBack('/content/shop-list', {
        queryParams: { newItem: JSON.stringify(newItem) },
      });
    } else {
      console.log('Lütfen tüm alanları doldurun!');
    }
  }
}
