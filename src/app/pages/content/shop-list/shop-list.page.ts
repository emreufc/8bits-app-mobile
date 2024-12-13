import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular'; // ModalController eklendi
import { ActivatedRoute } from '@angular/router';
import { AddItemComponent } from 'src/app/shared/components/add-item/add-item.component';

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
  nextId: number = 9; // Yeni item ID'si için başlangıç

  // ModalController'ı constructor'a ekle
  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
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

  /**
   * @function filterItems
   * @description
   * Bu fonksiyon, `searchTerm` değişkenine göre `shoppingItems` listesini filtreler.
   * Eğer `searchTerm` boş ise, `shoppingItems` listesinin tamamını `filteredItems` listesine kopyalar.
   * Eğer `searchTerm` dolu ise, `shoppingItems` listesindeki öğelerin isimlerini küçük harfe çevirir ve
   * `searchTerm` ile eşleşenleri `filteredItems` listesine ekler.
   *
   * @returns {void}
   */
  filterItems(): void {
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

  // Modal açma fonksiyonu: yeni öğe eklemek için bir modal sayfa açıyoruz
  /**
   * AddItemComponent bileşenini açan bir modal oluşturur.
   * 
   * Kullanıcı modal içinde yeni bir öğe eklerse, bu öğeyi alışveriş listesine ekler.
   * 
   * @returns {Promise<void>} Modal işlemi tamamlandığında bir Promise döner.
   */
  async openAddItemModal() {
    // ModalController ile oluşturacağımız AddItemModalPage componentini açıyoruz
    const modal = await this.modalCtrl.create({
      component: AddItemComponent, 
    });

    // Modal kapandıktan sonra geri dönen item verisini yakalıyoruz
    modal.onDidDismiss().then((res) => {
      if (res.data) {
        // Kullanıcının modal içinde girdiği newItem objesini alıyor
        this.addItemToShoppingList(res.data);
      }
    });

    await modal.present();
  }

  // Yeni öğeyi alışveriş listesine ekle
  addItemToShoppingList(newItem: ShoppingItem) {
    // Liste içinde aynı item var mı kontrol et
    const existingItem = this.shoppingItems.find(
      item => item.name === newItem.name && item.unit === newItem.unit
    );
  
    if (existingItem) {
      // Aynı item varsa quantity'yi artır
      existingItem.quantity += newItem.quantity;
    } else {
      // Aynı item yoksa yeni bir item olarak ekle
      newItem.id = this.nextId++; // Yeni ID ata
      this.shoppingItems.push(newItem);
    }
  
    // Filtreleme işlemini güncelle
    this.filterItems();
  }

}

