import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddItemComponent } from 'src/app/shared/components/add-item/add-item.component';
import { Ingredient } from 'src/app/core/models/ingredient';
import { AlertController } from '@ionic/angular';

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

  constructor(private modalController: ModalController,
    private  alertController: AlertController) {}
  ngOnInit() {
    this.filterItems();
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value;
    this.filterItems();
  }

  /**
   * @function filterItems
   * @description
   * Bu fonksiyon, `searchTerm` değişkenine göre `shoppingItems` listesini filtreler.
   * Eğer `searchTerm` boş ise, `shoppingItems` listesinin tamamını `filteredItems` listesine kopyalar.
   * Eğer `searchTerm` dolu ise, `shoppingItems` listesindeki öğelerin isimlerini küçük harfe çevirir ve
   * `searchTerm` ile eşleşenleri `filteredItems` listesine ekler.
   * Eğer eşleşen öğe yoksa kullanıcıya bir mesaj gösterir.
   *
   * @returns {void}
   */
  
  filterItems(): void {
    if (!this.searchTerm) {
      this.filteredItems = [...this.shoppingItems];
    } else {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredItems = this.shoppingItems.filter(item =>
        item.ingredientName.toLowerCase().includes(searchTermLower)
      );

      if (this.filteredItems.length === 0) {
        this.showNoResultsMessage();
      }
    }
  }

  /**
   * @function showNoResultsMessage
   * @description
   * Kullanıcıya hiçbir eşleşme bulunamadığına dair bir mesaj gösterir.
   *
   * @returns {void}
   */
  async showNoResultsMessage(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Sonuç Bulunamadı',
      message: 'Aramanıza uygun bir ürün bulunamadı.',
      buttons: ['Tamam'],
    });

    await alert.present();
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