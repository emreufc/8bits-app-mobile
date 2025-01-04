import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  @Input() chips: string[] = []; // Dışarıdan gelen chip array
  @Output() chipSelected = new EventEmitter<string>(); // Seçilen chip'i dışarı iletmek için EventEmitter
  selectedChip: string = '';

  constructor() {}

  selectChip(chip: string) {
    this.selectedChip = chip; // Seçilen chip'i güncelle
    this.chipSelected.emit(chip); // Seçimi üst bileşene ilet
  }

  ngOnInit() {
    // Eğer chips array boş değilse varsayılan olarak ilk chip'i seç
    if (this.chips && this.chips.length > 0) {
      this.selectedChip = this.chips[0];
      this.chipSelected.emit(this.selectedChip); // İlk chip'i de üst bileşene ilet
    }
    console.log('CategoryComponent initialized with chips:', this.chips);
    console.log('Selected chip:', this.selectedChip);
  }

}
