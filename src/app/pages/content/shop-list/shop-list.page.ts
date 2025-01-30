import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { AddItemComponent } from 'src/app/shared/components/add-item/add-item.component';
import { Ingredient } from 'src/app/core/models/ingredient';
import { ShopListService } from 'src/app/core/services/shop-list.service';
import { forkJoin } from 'rxjs';
import { IngredientService } from 'src/app/core/services/ingredient.service';
import { KitchenService } from 'src/app/core/services/kitchen.service';

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.page.html',
  styleUrls: ['./shop-list.page.scss'],
})
export class ShopListPage implements OnInit {
  shoppingItems: any[] = [];
  filteredItems: any[] = [];
  searchTerm: string = '';
  isSelectMode: boolean = false; // Seçim modunda olup olmadığını kontrol eder
  selectedItems: any[] = []; // Seçilen öğeleri tutar

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController, // ToastController eklendi
    private shopListService: ShopListService, // ShopListService eklendi
    private kitchenService: KitchenService, // KitchenService eklendi
    
  ) {}

  ngOnInit() {
    // this.loadShoppingList();
    this.getMyShoppingList()
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
      this.filteredItems = this.shoppingItems.filter((item:any) =>
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

  toggleItemSelection(item: any) {
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
    const removedItemIds = this.selectedItems.map((item) => item.shoppingListId);

    try {
      // Seçilen her öğe için API çağrısı yap
      await Promise.all(
        removedItemIds.map((id) => this.shopListService.deleteItemFromList(id).toPromise())
      );

      // Başarılı API çağrılarından sonra öğeleri listeden kaldır
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
    } catch (error) {
      console.error('Öğeler kaldırılırken hata oluştu:', error);
      // Hata durumunda toast mesajı
      const toast = await this.toastController.create({
        message: 'Öğeler kaldırılırken bir hata oluştu. Lütfen tekrar deneyin.',
        duration: 2000,
        position: 'bottom',
        color: 'danger',
      });
      await toast.present();
    }
  }

  async addToKitchen() {
    console.log('Seçilenler mutfağa eklendi:', this.selectedItems);

    try {
      // Seçilen her öğe için API çağrısı yap
      await Promise.all(
        this.selectedItems.map((item) =>
          this.kitchenService.addshopListToKitchen({
            ingredientId: item.ingredientId,
            quantityTypeId: item.quantityTypeId,
            quantity: item.quantity
          }).toPromise()
        )
      )
      this.getMyShoppingList();
      // Tüm öğeler seçili mi kontrol et
      if (this.selectedItems.length === this.shoppingItems.length) {
        this.showToast('Tüm ürünler mutfağa eklendi.');
      } else {
        const toast = await this.toastController.create({
          message: `${this.selectedItems.map(item => item.ingredientName).join(', ')} başarıyla mutfağa eklendi.`,
          duration: 1000,
          position: 'bottom',
          color: 'success',
        });
        await toast.present();    
      }
         // this.removeSelectedItems(); // Mutfağa eklenenler alışveriş listesinden kaldırılır
    }  catch (error) {
      console.error('Öğeler mutfağa eklenirken hata oluştu:', error);
      const toast = await this.toastController.create({
        message: `${this.selectedItems.map(item => item.ingredientName).join(', ')}  mutfağa eklenirken bir hata oluştu.`,
        duration: 1000,
        position: 'bottom',
        color: 'danger',
      });
      await toast.present();    }
  }

  async openAddItemModal() {
    const modal = await this.modalController.create({
      component: AddItemComponent,
      componentProps: { origin: 'shoplist' }, // Kitchen'dan açıldığını belirtiyoruz

    });

    modal.onDidDismiss().then((res) => {
      console.log('Modal dismissed with data:', res);
      if (res.data) {
      console.log('Data received:', res.data);
      this.getMyShoppingList();
      }
    });

    await modal.present();
  }

  getMyShoppingList() {
    this.shopListService.getShoppingList().subscribe({
      next: (response) => {
        if (response.code === 200 && response.data) {
          // Yine aynı şekilde kopyalayarak ters çeviriyoruz
          this.shoppingItems = [...response.data].reverse();
          this.filterItems();
          console.log("Alışveriş listesi başarıyla yüklendi:", this.shoppingItems);
        } else {
          console.error("API'den geçersiz veri alındı:", response);
        }
      },
      error: (error) => {
        console.error("Alışveriş listesi yüklenirken hata oluştu:", error);
      },
    });
  
    // Yukarıdaki açıklama burada da geçerli. Dizi gelmeden filterItems çalışırsa
    // filterItems içinde bu.shoppingItems henüz boş olabilir.
    this.filterItems();
  }

  
  async removeItem(id: number) {
    const removedItem = this.shoppingItems.find((item: any) => item.ingredientId === id);
    console.log('Kaldırılacak öğe:', removedItem);
    id = removedItem.shoppingListId;
    if (removedItem) {
      try {
        // API çağrısı yaparak öğeyi sil
        console.log('Kaldırılacak öğe ID:', id);
        await this.shopListService.deleteItemFromList(id).toPromise();
        this.getMyShoppingList();
        // Başarılı toast mesajı
        const toast = await this.toastController.create({
          message: `${removedItem.ingredientName} başarıyla kaldırıldı.`,
          duration: 1000,
          position: 'bottom',
          color: 'warning',
        });
        await toast.present();
      } catch (error) {
        console.error('Öğe kaldırılırken hata oluştu:', error);
        // Hata durumunda toast mesajı
        const toast = await this.toastController.create({
          message: 'Öğe kaldırılırken bir hata oluştu. Lütfen tekrar deneyin.',
          duration: 2000,
          position: 'bottom',
          color: 'danger',
        });
        await toast.present();
      }
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

