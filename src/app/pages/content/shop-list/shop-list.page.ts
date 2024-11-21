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

  constructor(private navCtrl: NavController, private route: ActivatedRoute) {}

  ngOnInit() {
    // Başlangıç öğeleri
    this.shoppingItems = [
      { id: 1, name: 'Extra-virgin olive oil', quantity: 1, unit: 'tbsp' },
      { id: 2, name: 'Extra-virgin olive oil', quantity: 1, unit: 'tbsp' },
      { id: 3, name: 'Walnuts', quantity: 1, unit: 'cup' },
      { id: 4, name: 'Mushrooms', quantity: 150, unit: 'g' },
      { id: 5, name: 'Garlic clove', quantity: 1, unit: 'pcs' },
      { id: 6, name: 'Tomato paste', quantity: 0.5, unit: 'tbsp' },
      { id: 8, name: 'Red pepper flakes', quantity: 1, unit: 'pinch' },
    ];
    this.filteredItems = [...this.shoppingItems];

    // Yeni öğeyi query parametreleriyle al ve ekle
    this.route.queryParams.subscribe((params) => {
      if (params['newItem']) {
        const newItem: ShoppingItem = JSON.parse(params['newItem']);
        this.addItemToShoppingList(newItem);
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
      this.filteredItems = this.shoppingItems.filter(item =>
        item.name.toLowerCase().includes(searchTermLower)
      );
    }
  }

  removeItem(id: number) {
    this.shoppingItems = this.shoppingItems.filter(item => item.id !== id);
    this.filterItems();
  }

  goToAddNewItem() {
    this.navCtrl.navigateForward('/content/addnewitem');
  }

  // Yeni öğeyi alışveriş listesine ekleyin
  addItemToShoppingList(item: ShoppingItem) {
    // Yeni öğeyi shoppingItems'e ekleyin
    this.shoppingItems.push(item);
    
    // Sonra filtreli öğeleri güncelleyin
    this.filterItems();
  }
}
