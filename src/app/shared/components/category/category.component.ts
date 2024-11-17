import { Component, OnInit, ViewChild } from '@angular/core';
import Swiper from 'swiper';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent  implements OnInit {

  selectedMealIndex: number = 0;
  meals = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  constructor() {}

  ngOnInit() {}

  selectMeal(index: number) {
    this.selectedMealIndex = index;
  }

}
