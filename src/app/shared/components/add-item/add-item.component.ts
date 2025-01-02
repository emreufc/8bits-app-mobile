import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { IngredientService } from 'src/app/core/services/ingredient.service';
import { Ingredient } from 'src/app/core/models/ingredient';
import { ShopListService } from 'src/app/core/services/shop-list.service';
import { KitchenService } from 'src/app/core/services/kitchen.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
})
export class AddItemComponent implements OnInit {
  allIngredients: any; // Tüm malzemeler (arama için)
  ingredients: any[] = []; // API'den gelen malzemeler
  filteredItems: any[] = []; // Filtrelenmiş malzemeler
  searchTerm: string = ''; // Arama terimi
  currentPage: number = 1; // İlk sayfa
  pageSize: number = 10; // Sayfa başına öğe sayısı
  hasMore: boolean = true; // Daha fazla veri var mı
  selectedItem: any | null = null; // Seçilen malzeme
  selectedQuantityTypeId: number | null = null; // Seçilen quantityTypeId
  quantity: number | null = null; // Kullanıcıdan alınan miktar
  @Input() origin!: string; // Modal açılırken gelen parametre


  constructor(
    private modalCtrl: ModalController,
    private ingredientService: IngredientService,
    private shopListService: ShopListService,
    private alertController: AlertController,
    private toastController: ToastController,
    private kitchenService: KitchenService
  ) {}

  ngOnInit() {
    this.loadIngredients(); // İlk sayfayı yükle
    this.loadAllIngredients(); // Tüm verileri yükle (arama için)
  }

  // Quantity Type değişimi
  onQuantityTypeChange(event: any) {
    this.selectedQuantityTypeId = event.detail.value ? +event.detail.value : null; // Gelen değeri sayıya çevir
  }

  // Malzeme gönderme işlemi
  onAddToList() {
    if (this.selectedItem && this.selectedQuantityTypeId && this.quantity) {
      const ingredientId = this.selectedItem.ingredientId;

      // API'den malzeme bilgilerini al
      this.ingredientService.getIngredientById(ingredientId).subscribe(
        async (response) => {
          if (response?.code === 200 && response?.data) {
            // Gelen veriyi işle
            const ingredientData = response.data.ingredient;
            const quantityTypeIds = response.data.quantityTypeIds;
            const quantityTypes = response.data.quantityTypes;

            // UI için selectedItem güncellemesi
            // this.selectedItem = {
            //   ...ingredientData,
            //   quantityTypeIds,
            //   quantityTypes,
            // };
            this.selectedItem = response.data;

            this.showToast('Malzeme başarıyla yüklendi ve eklendi!', 'success');
          } else {
            this.showToast('Malzeme bilgileri alınırken bir hata oluştu!', 'danger');
          }
        },
        async () => {
          this.showToast('Malzeme eklenirken bir hata oluştu!', 'danger');
        }
      );
    } else {
      this.showToast('Lütfen tüm alanları doldurun!', 'warning');
    }
  }

  // Toast mesajı
  private async showToast(message: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000,
      color: color,
      position: 'bottom',
    });
    await toast.present();
  }

  

  // Malzemeleri yükler
  async loadIngredients(event?: any) {
    try {
      const response = await this.ingredientService
        .getIngredients(this.currentPage, this.pageSize)
        .toPromise();
      console.log('Malzemeler yüklendi:', response.data);
      // Gelen veriyi işleme
      // const ingredients = response.data.map((item: any) => ({
      //   ingredientId: item.ingredient.ingredientId,
      //   ingredientName: item.ingredient.ingredientName,
      //   ingImgUrl: item.ingredient.ingImgUrl,
      //   quantityTypeIds: item.quantityTypeIds,
      //   quantityTypes: item.quantityTypes,
      // }));
      // console.log('İşlenmiş malzemeler:', ingredients);
  
      // Mevcut listeye yeni gelenleri ekle'
      this.ingredients = [...this.ingredients, ...response.data];

      console.log('İşlenmiş malzemeler after:', this.ingredients);
  
      // Filtreleme için güncelle
      this.filteredItems = [...this.ingredients];
  
      // Sayfalama kontrolü
      this.hasMore = response.pagination.currentPage < response.pagination.totalPages;
  
      // Sonsuz kaydırma kontrolü
      if (event) {
        event.target.complete();
      }
  
      // Sayfa numarasını artır
      this.currentPage++;
    } catch (error) {
      console.error('Malzemeler yüklenirken hata oluştu:', error);
      if (event) {
        event.target.complete();
      }
    }
  }
  
  
  // Tüm malzemeleri yükler (arama için)
  async loadAllIngredients() {
    try {
      const response = await this.ingredientService
        .getIngredients(1, 750) 
        .toPromise();

      this.allIngredients = response.data;
      // this.allIngredients = this.allIngredients.map((item: any) => item.ingredient); 
      console.log('Tüm malzemeler yüklendi:', response.data);
    } catch (error) {
      console.error('Tüm malzemeler yüklenirken hata oluştu:', error);
    }
  }

  onSearchChange(event: any) {
    console.log('Arama değişti:', event.detail.value);
    this.searchTerm = event.detail.value;
    console.log('Arama terimi:', this.searchTerm);
    console.log('Tüm malzemeler:', this.allIngredients);
    console.log('This malzemeler:', this.ingredients);
    if (!this.searchTerm) {
      this.filteredItems = this.ingredients; // Sayfalı listeyi göster
      console.log('Arama terimi boş, tüm malzemeler gösteriliyor.');
      return;
    }
  
    const lowerTerm = this.searchTerm.toLowerCase();
    console.log('Arama terimi küçük harfe çevrildi:', lowerTerm);
    // this.filteredItems = this.allIngredients;
    this.filteredItems = this.allIngredients
      // .map((item: any) => item.ingredient)
      .filter((item: any) => 
        item.ingredient?.ingredientName?.toLowerCase().includes(lowerTerm) // ingredientName undefined kontrolü
      );
    console.log('Filtrelenmiş malzemeler:', this.filteredItems);
  
    this.hasMore = false; // Sonsuz kaydırmayı etkinleştir
    console.log('Sonsuz kaydırma devre dışı bırakıldı.');
  
    if (this.filteredItems.length === 0) {
      console.log('Hiçbir sonuç bulunamadı.');
      this.showNoResultsMessage();
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
      message: 'Aramanıza uygun bir malzeme bulunamadı.',
      buttons: ['Tamam'],
    });

    await alert.present();
  }


  loadMoreIngredients(event: any) {
    if (this.hasMore) {
      this.loadIngredients(event);
    } else {
      event.target.complete();
    }
  }

  selectItem(item: any) {
    console.log('Seçilen malzeme:', item);
    this.selectedItem = { ...item };
  }

  // async confirmItem() {
  //   if (!this.selectedItem) return;
  
  //   console.log('ShoppingList\'e ekleme işlemi başlıyor...');
  //   try {
  //     const apiPayload = {
  //       ingredientId: this.selectedItem.ingredientId || 0, // ingredientId mutlaka olmalı
  //       quantityTypeId: this.selectedItem.quantityTypeID || 0, // quantityTypeId eksikse varsayılan ver
  //       quantity: this.selectedItem.quanity || 1 // quantity eksikse varsayılan ver
  //     };
  
  //     console.log('API\'ye gönderilen veri:', apiPayload);
  
  //     const response = await this.shopListService.addToList(apiPayload).toPromise();
  //     console.log('ShoppingList\'e başarıyla eklendi:', response);
  //     this.modalCtrl.dismiss(this.selectedItem); // Modalı kapat ve sonucu döndür
  //   } catch (error) {
  //     console.error('ShoppingList\'e eklenirken hata oluştu:', error);
  //   }
  // }

  confirmItem() {
    if (!this.selectedItem || !this.quantity || !this.selectedQuantityTypeId) {
      console.error("Eksik bilgiler var. Lütfen tüm alanları doldurun.");
      this.showToast('Lütfen tüm alanları doldurun!', 'warning');
      return;
    }
  
    const payload = {
      ingredientId: this.selectedItem.ingredient.ingredientId,
      quantityTypeId: this.selectedQuantityTypeId,
      quantity: this.quantity,
    };
  
    console.log("Payload:", payload);
  
    if (this.origin === 'kitchen') {
      this.kitchenService.addKitchenItem(payload).subscribe({
        next: (response) => {
          console.log("Malzeme başarıyla mutfağa eklendi:", response);
          this.modalCtrl.dismiss(this.selectedItem);
        },
        error: (error) => {
          console.error("Malzeme mutfağa eklenirken hata oluştu:", error);
          this.modalCtrl.dismiss({
            success: false,
            message: "Malzeme mutfağa eklenirken bir hata oluştu.",
          });
        },
      });
    } else if (this.origin === 'shoplist') {
      this.shopListService.addToList(payload).subscribe({
        next: (response) => {
          console.log("Malzeme başarıyla alışveriş listesine eklendi:", response);
          this.modalCtrl.dismiss(this.selectedItem);
        },
        error: (error) => {
          console.error("Malzeme alışveriş listesine eklenirken hata oluştu:", error);
          this.modalCtrl.dismiss({
            success: false,
            message: "Malzeme alışveriş listesine eklenirken bir hata oluştu.",
          });
        },
      });
    }
  }

// confirmItem() {
//   if (!this.selectedItem) return;
//   console.log('Selected Item:', this.selectedItem);
//   this.modalCtrl.dismiss(this.selectedItem);
// }


  cancel() {
    this.modalCtrl.dismiss(null);
  }
}
