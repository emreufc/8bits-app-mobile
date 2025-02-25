import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  isLiked: boolean = false; // Varsayılan olarak içi boş kalp

  recipes = [
    {
      id : 1,
      title: 'Vegetable Noodle',
      image: 'https://via.placeholder.com/400?text=Vegetable+Noodle',
      rating: 4.3,
      time: '20 min',
      views: '2.3K',
      isLiked: false,
    },
    {
      id : 2,
      title: 'Chicken Curry',
      image: 'https://via.placeholder.com/400?text=Chicken+Curry',
      rating: 4.8,
      time: '45 min',
      views: '5.1K',
      isLiked: false,
    },
  {
    id : 3,
    title: 'Beef Stroganoff',
    image: 'https://via.placeholder.com/400?text=Beef+Stroganoff',
    rating: 4.5,
    time: '30 min',
    views: '3.8K',
    isLiked: false,
  },
  {
    title: 'Spaghetti Bolognese',
    image: 'https://via.placeholder.com/400?text=Spaghetti+Bolognese',
    rating: 4.7,
    time: '40 min',
    views: '4.2K',
    isLiked: false,
  },
  {
    id : 5,
    title: 'Grilled Salmon',
    image: 'https://via.placeholder.com/400?text=Grilled+Salmon',
    rating: 4.9,
    time: '25 min',
    views: '6.1K',
    isLiked: false,
  },
  {
    id : 6,
    title: 'Caesar Salad',
    image: 'https://via.placeholder.com/400?text=Caesar+Salad',
    rating: 4.2,
    time: '15 min',
    views: '2.9K',
    isLiked: false,
  }
  ];

    // Kalp durumunu değiştirir
    toggleLike() {
      this.isLiked = !this.isLiked;
      console.log('Kalp durumu:', this.isLiked ? 'Beğenildi' : 'Beğenilmedi');
    }

  constructor() { }

  
  ngOnInit() {console.log('SearchPage initialized');}

}
