import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  isLiked: boolean = false; // Varsayılan olarak içi boş kalp

  recipes = [
    {
      title: 'Vegetable Noodle',
      image: 'https://via.placeholder.com/400?text=Vegetable+Noodle',
      rating: 4.3,
      time: '20 min',
      views: '2.3K',
      isLiked: false,
    },
    {
      title: 'Chicken Curry',
      image: 'https://via.placeholder.com/400?text=Chicken+Curry',
      rating: 4.8,
      time: '45 min',
      views: '5.1K',
      isLiked: false,
    },
  {
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
    title: 'Grilled Salmon',
    image: 'https://via.placeholder.com/400?text=Grilled+Salmon',
    rating: 4.9,
    time: '25 min',
    views: '6.1K',
    isLiked: false,
  },
  {
    title: 'Caesar Salad',
    image: 'https://via.placeholder.com/400?text=Caesar+Salad',
    rating: 4.2,
    time: '15 min',
    views: '2.9K',
    isLiked: false,
  }
  ];

    // Kalp durumunu değiştirir
    toggleLike(recipe: any) {
      recipe.isLiked = !recipe.isLiked;
      console.log(`${recipe.title} durumu: ${recipe.isLiked ? 'Beğenildi' : 'Beğenilmedi'}`);
    }

  
  constructor() { }

  ngOnInit() {console.log();
  }

}
