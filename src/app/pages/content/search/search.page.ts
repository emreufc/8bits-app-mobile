import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  chips: string[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack','Dessert', 'Drink']; // Chip'ler
  selectedChip: string = '';

  constructor() { }

  selectChip(chip: string) {
    this.selectedChip = chip; // Seçilen chip'i güncelle
  }


  ngOnInit() {
  }

}
