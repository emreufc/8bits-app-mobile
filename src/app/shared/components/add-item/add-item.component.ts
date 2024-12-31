import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IngredientService } from 'src/app/core/services/ingredient.service';
import { Ingredient } from 'src/app/core/models/ingredient';
import { ShopListService } from 'src/app/core/services/shop-list.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
})
export class AddItemComponent implements OnInit {

  ingredients: Ingredient[] = []; // API'den gelen malzemeler
  filteredItems: Ingredient[] = []; // Filtrelenmiş malzemeler
  searchTerm: string = ''; // Arama terimi
  currentPage: number = 1; // İlk sayfa
  pageSize: number = 10; // Sayfa başına öğe sayısı
  hasMore: boolean = true; // Daha fazla veri var mı
  selectedItem: Ingredient | null = null; // Seçilen malzeme

  constructor(
    private modalCtrl: ModalController,
    private ingredientService: IngredientService,
    private shopListService: ShopListService
  ) {}

  ngOnInit() {
    this.loadIngredients(); // İlk sayfayı yükle
  }

  // Malzemeleri yükler
  async loadIngredients(event?: any) {
    try {
      const response = await this.ingredientService
        .getIngredients(this.currentPage, this.pageSize)
        .toPromise();

      this.ingredients = [...this.ingredients, ...response.data]; // Mevcut listeye ekle
      this.filteredItems = [...this.ingredients]; // Filtreleme için güncelle
      this.hasMore = response.pagination.currentPage < response.pagination.totalPages;

      if (event) {
        event.target.complete(); // Sonsuz kaydırmayı tamamla
      }

      this.currentPage++;
    } catch (error) {
      console.error('Malzemeler yüklenirken hata oluştu:', error);
      if (event) {
        event.target.complete();
      }
    }
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value;

    if (!this.searchTerm) {
      this.filteredItems = [...this.ingredients];
      return;
    }

    const lowerTerm = this.searchTerm.toLowerCase();
    this.filteredItems = this.ingredients.filter(item =>
      item.ingredientName.toLowerCase().includes(lowerTerm)
    );
  }

  loadMoreIngredients(event: any) {
    if (this.hasMore) {
      this.loadIngredients(event);
    } else {
      event.target.complete();
    }
  }

  selectItem(item: Ingredient) {
    this.selectedItem = { ...item };
  }

  async confirmItem() {
    if (!this.selectedItem) return;
  
    console.log('ShoppingList\'e ekleme işlemi başlıyor...');
    try {
      const apiPayload = {
        ingredientId: this.selectedItem.ingredientId || 0, // ingredientId mutlaka olmalı
        quantityTypeId: this.selectedItem.quantityTypeID || 0, // quantityTypeId eksikse varsayılan ver
        quantity: this.selectedItem.quanity || 1 // quantity eksikse varsayılan ver
      };
  
      console.log('API\'ye gönderilen veri:', apiPayload);
  
      const response = await this.shopListService.addToList(apiPayload).toPromise();
      console.log('ShoppingList\'e başarıyla eklendi:', response);
      this.modalCtrl.dismiss(this.selectedItem); // Modalı kapat ve sonucu döndür
    } catch (error) {
      console.error('ShoppingList\'e eklenirken hata oluştu:', error);
    }
  }
  

  cancel() {
    this.modalCtrl.dismiss(null);
  }
}
