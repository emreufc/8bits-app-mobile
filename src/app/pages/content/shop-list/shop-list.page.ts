import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddItemComponent } from 'src/app/shared/components/add-item/add-item.component';
import { Ingredient } from 'src/app/core/models/ingredient';

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.page.html',
  styleUrls: ['./shop-list.page.scss'],
})
export class ShopListPage implements OnInit {
  shoppingItems: Ingredient[] = [];
  filteredItems: Ingredient[] = [];
  searchTerm: string = '';
  isSelectMode: boolean = false; // Seçim modunda olup olmadığını kontrol eder
  selectedItems: Ingredient[] = []; // Seçilen öğeleri tutar

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.filterItems();
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
        item.ingredientName.toLowerCase().includes(searchTermLower)
      );
    }
  }

  toggleSelectMode() {
    this.isSelectMode = !this.isSelectMode;
    if (!this.isSelectMode) {
      this.selectedItems = []; // Seçim modundan çıkıldığında seçimleri temizle
    }
  }

  toggleItemSelection(item: Ingredient) {
    if (this.selectedItems.includes(item)) {
      this.selectedItems = this.selectedItems.filter((i) => i !== item);
    } else {
      this.selectedItems.push(item);
    }
  }

  selectAllItems() {
    if (this.selectedItems.length === this.shoppingItems.length) {
      this.selectedItems = []; // Tüm seçimleri kaldır
    } else {
      this.selectedItems = [...this.shoppingItems]; // Tüm itemleri seç
    }
  }

  removeSelectedItems() {
    this.shoppingItems = this.shoppingItems.filter(
      (item) => !this.selectedItems.includes(item)
    );
    this.filterItems();
    this.toggleSelectMode(); // Seçim modundan çık
    this.selectedItems = [];
  }

  addToKitchen() {
    console.log('Seçilenler mutfağa eklendi:', this.selectedItems);
    this.removeSelectedItems(); // Mutfağa eklenenler alışveriş listesinden kaldırılır
  }

  async openAddItemModal() {
    const modal = await this.modalController.create({
      component: AddItemComponent,
    });

    modal.onDidDismiss().then((res) => {
      if (res.data) {
        this.addItemToShoppingList(res.data);
      }
    });

    await modal.present();
  }

  addItemToShoppingList(newItem: Ingredient) {
    const existingItem = this.shoppingItems.find(
      (item) => item.ingredientName === newItem.ingredientName
    );

    if (!existingItem) {
      this.shoppingItems.push(newItem);
    }

    this.filterItems();
  }

  removeItem(id: number) {
    // Belirli bir öğeyi alışveriş listesinden kaldır
    this.shoppingItems = this.shoppingItems.filter(
      (item) => item.ingredientId !== id
    );
    this.filterItems(); // Filtrelenmiş listeyi güncelle
  }

}
