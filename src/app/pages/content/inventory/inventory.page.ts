import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AddItemComponent } from 'src/app/shared/components/add-item/add-item.component';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ShopListService } from 'src/app/core/services/shop-list.service';
import { Ingredient } from 'src/app/core/models/ingredient';
import { KitchenService } from 'src/app/core/services/kitchen.service';


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {
  searchTerm: string = '';
  shoppingItems: any[] = [];
  filteredItems: any[] = [];
  selectedItems: any[] = [];
  isSelectMode: boolean = false;
  currentFilter: string = 'hepsi'; // Varsayılan olarak 'hepsi'
  chips: string[] = ['Hepsi', 'Baharat', 'Bakliyat', 'Cikolata ve Soslar', 'Icecek', 'Kuruyemis', 'Meyve', 'Sebze', 'Sut Urunleri', 'Temel Gida'];

  constructor(
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private shopListService: ShopListService,
    private kitchenService: KitchenService
  ) {}

  ngOnInit() {
    this.getMyInventory();
  }

  onFilterChange(filter: string): void {
    this.currentFilter = filter.toLowerCase(); // Filtreyi küçük harfe çevir
    this.getMyInventory(); // Filtreye göre tarifleri yükle
  }
  getMyInventory() {
    // modal dan döndüğünde çalışan kod -> burada api ye get isteği atılacak response shopping items a eşitlenecek
    this.kitchenService.getKitchenList().subscribe({
      next: (response) => {
        if (response.code === 200 && response.data) {
          this.shoppingItems = response.data;
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
      this.filteredItems = this.shoppingItems.filter((item:any) =>
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

  async openAddItemModal() {
    const modal = await this.modalCtrl.create({
      component: AddItemComponent,
      componentProps: { origin: 'kitchen' }, // Kitchen'dan açıldığını belirtiyoruz
    });

    modal.onDidDismiss().then((res) => {
      if (res.data) {
        console.log('Modal kapatıldı ve veri döndü:', res.data);
        this.getMyInventory()     // Başarılı toast mesajı
        console.log('Kitchen geri döndürüldü', this.shoppingItems)
        this.showToast(`${res.data.ingredient.ingredientName} mutfağa başarıyla eklendi.`);
        console.log('Modal kapatıldı ve veri döndü:', res.data.ingredientName);
      }
    });

    await modal.present();
  }

  // ** Seçme ve Silme İşlevleri **

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
    const removedItemIds = this.selectedItems.map((item) => item.inventoryId);

    try {
      // Seçilen her öğe için API çağrısı yap
      await Promise.all(
        removedItemIds.map((id) => this.kitchenService.deleteKitchenItem(id).toPromise())
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


  async removeItem(id: number) {
    const removedItem = this.shoppingItems.find((item: any) => item.ingredientId === id);
    console.log('Kaldırılacak öğe:', removedItem);
    id = removedItem.inventoryId;
    if (removedItem) {
      try {
        // API çağrısı yaparak öğeyi sil
        console.log('Kaldırılacak öğe ID:', id);
        await this.kitchenService.deleteKitchenItem(id).toPromise();
        this.getMyInventory();
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
