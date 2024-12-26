import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  @Input() chips: string[] = []; // Dışarıdan gelen chip array
  selectedChip: string = '';

  constructor() {}

  selectChip(chip: string) {
    this.selectedChip = chip; // Seçilen chip'i güncelle
  }

  ngOnInit() {
    // Eğer chips array boş değilse varsayılan olarak ilk chip'i seç
    if (this.chips && this.chips.length > 0) {
      this.selectedChip = this.chips[0];
    }
    console.log('CategoryComponent initialized with chips:', this.chips);
  }
}
