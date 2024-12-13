import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

// Mevcut ShoppingItem interface
interface ShoppingItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
}

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
})
export class AddItemComponent implements OnInit {

  allAvailableItems: ShoppingItem[] = [
    { id: 100, name: 'Milk', quantity: 1, unit: 'L' },
    { id: 101, name: 'Butter', quantity: 1, unit: 'pcs' },
    { id: 102, name: 'Eggs', quantity: 12, unit: 'pcs' },
    { id: 103, name: 'Flour', quantity: 500, unit: 'g' },
  ];

  filteredItems: ShoppingItem[] = [];
  selectedItem: ShoppingItem | null = null;

  unitOptions: string[] = ['tbsp','cup','pcs','g','ml','pinch'];
  activeUnit: string = 'tbsp'; 
  searchTerm: string = '';
  quantity: number = 1;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.filteredItems = [...this.allAvailableItems];
  }

  fetchItemsFromAPI() {
    // API'den veri çekip allAvailableItems'e aktarabilirsiniz
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value;
    if (!this.searchTerm) {
      this.filteredItems = [...this.allAvailableItems];
      return;
    }
    const lowerTerm = this.searchTerm.toLowerCase();
    this.filteredItems = this.allAvailableItems.filter(item =>
      item.name.toLowerCase().includes(lowerTerm)
    );
  }

  selectItem(item: ShoppingItem) {
    this.selectedItem = { ...item };
    this.activeUnit = item.unit;
    this.quantity = item.quantity;
  }

  changeUnit(value: string | number | undefined) {
    if (value == null) return;
    // Eğer value numeric gelse bile string'e dönüştürürüz
    this.activeUnit = value.toString();
  }
  

  increment() {
    this.quantity++;
  }

  decrement() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  confirmItem() {
    if (!this.selectedItem) return;

    const newItem: ShoppingItem = {
      id: 0,
      name: this.selectedItem.name,
      quantity: this.quantity,
      unit: this.activeUnit
    }
    this.modalCtrl.dismiss(newItem);
  }

  cancel() {
    this.modalCtrl.dismiss(null);
  }
}
