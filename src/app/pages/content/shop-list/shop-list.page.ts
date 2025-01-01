import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
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

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController // ToastController eklendi
  ) {}

  ngOnInit() {
    this.filterItems();
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
      this.filteredItems = this.shoppingItems.filter(item =>
        item.ingredientName.toLowerCase().includes(searchTermLower)
      );

      if (this.filteredItems.length === 0) {
        this.showNoResultsMessage();
      }
    }
  }

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

      // Toast mesajı
      this.showToast(`${item.ingredientName} seçimi kaldırıldı.`);
    } else {
      this.selectedItems.push(item);

      // Toast mesajı
      this.showToast(`${item.ingredientName} seçildi.`);
    }
  }

  selectAllItems() {
    if (this.selectedItems.length === this.shoppingItems.length) {
      this.selectedItems = []; // Tüm seçimleri kaldır

      // Toast mesajı
      this.showToast('Tüm seçimler kaldırıldı.');
    } else {
      this.selectedItems = [...this.shoppingItems]; // Tüm itemleri seç

      // Toast mesajı
      this.showToast('Tüm ürünler seçildi.');
    }
  }

  async removeSelectedItems() {
    const removedItemNames = this.selectedItems.map((item) => item.ingredientName);

    this.shoppingItems = this.shoppingItems.filter(
      (item) => !this.selectedItems.includes(item)
    );
    this.filterItems();
    this.toggleSelectMode(); // Seçim modundan çık
    this.selectedItems = [];

     // Başarılı toast mesajı
     const toast = await this.toastController.create({
      message: `${removedItemNames.join(', ')} başarıyla kaldırıldı.`,
      duration: 1000,
      position: 'bottom',
      color: 'warning',
    });
    await toast.present();
  }

  addToKitchen() {
    console.log('Seçilenler mutfağa eklendi:', this.selectedItems);
    this.showToast('Seçilen ürünler mutfağa eklendi.');
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

      // Başarılı toast mesajı
      this.showToast(`${newItem.ingredientName} alışveriş listesine eklendi.`);
    }

    this.filterItems();
  }

  
  async removeItem(id: number) {
    const removedItem = this.shoppingItems.find((item) => item.ingredientId === id);

    if (removedItem) {
      this.shoppingItems = this.shoppingItems.filter(
        (item) => item.ingredientId !== id
      );
      this.filterItems();

      // Başarılı toast mesajı
      const toast = await this.toastController.create({
        message: `${removedItem.ingredientName} başarıyla kaldırıldı.`,
        duration: 1000,
        position: 'bottom',
        color: 'warning',
      });
      await toast.present();
    }
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();
  }
}
