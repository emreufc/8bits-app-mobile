import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AddItemComponent } from 'src/app/shared/components/add-item/add-item.component';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ShopListService } from 'src/app/core/services/shop-list.service';

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
    private modalCtrl: ModalController,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private shopListService: ShopListService
  ) {}

  ngOnInit() {
    this.filteredItems = [...this.shoppingItems];

    this.route.queryParams.subscribe((params) => {
      if (params['newItem']) {
        const newItem: Ingredient = JSON.parse(params['newItem']);
        this.addItemToShoppingList(newItem);
      }
    });
    this.loadShoppingList();
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

  async openAddItemModal() {
    const modal = await this.modalCtrl.create({
      component: AddItemComponent,
    });

    modal.onDidDismiss().then((res) => {
      if (res.data) {
        this.addItemToShoppingList(res.data);

        // Başarılı toast mesajı
        this.showToast(`${res.data.ingredientName} başarıyla eklendi.`);
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

  async removeSelectedItems() {
    console.log('Selected items:', this.selectedItems);
    const removedItemNames = this.selectedItems.map((item) => item.ingredientName);

    this.shoppingItems = this.shoppingItems.filter(
      (item) => !this.selectedItems.includes(item)
    );
    this.filterItems();
    this.toggleSelectMode();
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


  loadShoppingList() {
    this.shopListService.getShoppingList().subscribe({
      next: (response) => {
        if (response.code === 200 && response.data) {
          this.shoppingItems = response.data.map((item: any) => ({
            ingredientId: item.ingredientId,
            quantity: item.quantity,
            quantityTypeId: item.quantityTypeId,
          }));
          console.log("Alışveriş listesi başarıyla yüklendi:", this.shoppingItems);
        } else {
          console.error("API'den geçersiz veri alındı:", response);
        }
      },
      error: (error) => {
        console.error("Alışveriş listesi yüklenirken hata oluştu:", error);
      },
    });
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