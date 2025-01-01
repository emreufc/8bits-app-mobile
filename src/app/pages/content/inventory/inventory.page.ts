import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AddItemComponent } from 'src/app/shared/components/add-item/add-item.component';

export interface Ingredient {
  ingredientId: number;         // Malzeme ID'si
  ingredientName: string;       // Malzeme adı
  ingImgUrl: string;            // Malzeme görsel URL'si
  allergenId: number;           // Alerjen ID'si
  isDeleted: boolean;           // Silinme durumu
  allergen: any | null;         // Alerjen bilgisi (nullable)
}

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {
  searchTerm: string = '';
  shoppingItems: Ingredient[] = [];
  filteredItems: Ingredient[] = [];
  selectedItems: Ingredient[] = [];
  isSelectMode: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.filteredItems = [...this.shoppingItems];

    this.route.queryParams.subscribe((params) => {
      if (params['newItem']) {
        const newItem: Ingredient = JSON.parse(params['newItem']);
        this.addItemToShoppingList(newItem);
      }
    });
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value;
    this.filterItems();
  }

  filterItems(): void {
    if (!this.searchTerm) {
      this.filteredItems = [...this.shoppingItems];
    } else {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredItems = this.shoppingItems.filter((item) =>
        item.ingredientName.toLowerCase().includes(searchTermLower)
      );
    }
  }

  removeItem(id: number) {
    this.shoppingItems = this.shoppingItems.filter(
      (item) => item.ingredientId !== id
    );
    this.filterItems();
  }

  async openAddItemModal() {
    const modal = await this.modalCtrl.create({
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

  // ** Seçme ve Silme İşlevleri **

  toggleSelectMode() {
    this.isSelectMode = !this.isSelectMode;
    if (!this.isSelectMode) {
      this.selectedItems = [];
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
    this.selectedItems = [...this.filteredItems];
  }

  removeSelectedItems() {
    this.shoppingItems = this.shoppingItems.filter(
      (item) => !this.selectedItems.includes(item)
    );
    this.filterItems();
    this.toggleSelectMode(); // Seçim modundan çık
    this.selectedItems = [];
  }
}
