import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

interface ShoppingItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
}

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.page.html',
  styleUrls: ['./shop-list.page.scss'],
})
export class ShopListPage implements OnInit {
  searchTerm: string = '';
  shoppingItems: ShoppingItem[] = [];
  filteredItems: ShoppingItem[] = [];
  addedItemIds: Set<number> = new Set(); // Eklenen öğelerin ID'lerini tutmak için

  constructor(private navCtrl: NavController, private route: ActivatedRoute) {}

  ngOnInit() {
    // LocalStorage'dan alışveriş listesini yükleyin
    const storedItems = localStorage.getItem('shoppingItems');
    this.shoppingItems = storedItems ? JSON.parse(storedItems) : [
      { id: 1, name: 'Extra-virgin olive oil', quantity: 1, unit: 'tbsp' },
      { id: 2, name: 'Walnuts', quantity: 1, unit: 'cup' },
      { id: 3, name: 'Mushrooms', quantity: 150, unit: 'g' },
      { id: 4, name: 'Garlic clove', quantity: 1, unit: 'pcs' },
      { id: 5, name: 'Tomato paste', quantity: 0.5, unit: 'tbsp' },
      { id: 6, name: 'Red pepper flakes', quantity: 1, unit: 'pinch' },
    ];
    this.filteredItems = [...this.shoppingItems];
    this.shoppingItems.forEach((item) => this.addedItemIds.add(item.id)); // Mevcut ID'leri kaydet

    // Yeni öğeyi query parametreleri ile alın
    this.route.queryParams.subscribe((params) => {
      if (params['newItem']) {
        try {
          const newItem: ShoppingItem = JSON.parse(params['newItem']);
          this.addItemToShoppingList(newItem);
        } catch (error) {
          console.error('Invalid newItem data:', params['newItem']);
        }
      }
    });
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value;
    this.filterItems();
  }

  filterItems() {
    if (!this.searchTerm) {
      this.filteredItems = [...this.shoppingItems];
    } else {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredItems = this.shoppingItems.filter((item) =>
        item.name.toLowerCase().includes(searchTermLower)
      );
    }
  }

  removeItem(id: number) {
    this.shoppingItems = this.shoppingItems.filter((item) => item.id !== id);
    this.addedItemIds.delete(id); // ID'yi kaldır
    this.updateLocalStorage();
    this.filterItems();
  }

  goToAddNewItem() {
    this.navCtrl.navigateForward('/content/addnewitem');
  }

  addItemToShoppingList(item: ShoppingItem) {
    // Öğenin zaten eklenip eklenmediğini kontrol edin
    if (!this.addedItemIds.has(item.id)) {
      this.shoppingItems.push(item);
      this.addedItemIds.add(item.id); // Yeni ID'yi ekle
      this.updateLocalStorage();
      this.filterItems();
    } else {
      console.log('Bu öğe zaten eklendi.');
    }
  }

  private updateLocalStorage() {
    localStorage.setItem('shoppingItems', JSON.stringify(this.shoppingItems));
  }
}
