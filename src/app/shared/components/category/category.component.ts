import { Component, OnInit, ViewChild } from '@angular/core';
import Swiper from 'swiper';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent  implements OnInit {
  chips: string[] = ['All','Breakfast', 'Lunch', 'Dinner', 'Snack','Dessert', 'Drink']; // Chip'ler
  selectedChip: string = 'All';

  constructor() { }

  selectChip(chip: string) {
    this.selectedChip = chip; // Seçilen chip'i güncelle
  }


  ngOnInit() {console.log('SearchPage initialized');}

}


