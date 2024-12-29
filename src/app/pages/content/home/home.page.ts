import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  isLiked: boolean = false; // Varsayılan olarak içi boş kalp

  recipes = [
    {
      id: 1,
      title: 'Vegetable Noodle',
      image: 'https://via.placeholder.com/400?text=Vegetable+Noodle',
      rating: 4.3,
      time: '20 min',
      servings: 2,
      isLiked: false,
    },
    {
      id: 2,
      title: 'Chicken Curry',
      image: 'https://via.placeholder.com/400?text=Chicken+Curry',
      rating: 4.8,
      time: '45 min',
      servings: 4,
      isLiked: false,
    },
    {
      id: 3,
      title: 'Beef Stroganoff',
      image: 'https://via.placeholder.com/400?text=Beef+Stroganoff',
      rating: 4.5,
      time: '30 min',
      servings: 3,
      isLiked: false,
    },
    {
      id: 4,
      title: 'Spaghetti Bolognese',
      image: 'https://via.placeholder.com/400?text=Spaghetti+Bolognese',
      rating: 4.7,
      time: '40 min',
      servings: 5, // Ensure this is a number
      isLiked: false,
    },
    {
      id: 5,
      title: 'Grilled Salmon',
      image: 'https://via.placeholder.com/400?text=Grilled+Salmon',
      rating: 4.9,
      time: '25 min',
      servings: 2,
      isLiked: false,
    },
    {
      id: 6,
      title: 'Caesar Salad',
      image: 'https://via.placeholder.com/400?text=Caesar+Salad',
      rating: 4.2,
      time: '15 min',
      servings: 3,
      isLiked: false,
    }
  ];

    // Kalp durumunu değiştirir
    toggleLike(recipe: any, event: Event) {
      event.stopPropagation(); // Event'in parent elementlere yayılmasını durdur
      recipe.isLiked = !recipe.isLiked;
      console.log(`${recipe.title} durumu: ${recipe.isLiked ? 'Beğenildi' : 'Beğenilmedi'}`);
    }

  
  constructor(private router: Router) { }

  goToRecipeDetail(recipeId: number) {
    this.router.navigate(['/content/recipe-detail', recipeId]);
    console.log('Tarife git');  
  }

  handleLikeToggled(recipeId: number) {
    const index = this.recipes.findIndex((r) => r.id === recipeId);
    if (index !== -1) {
      const recipe = this.recipes[index];
      this.recipes[index] = { ...recipe, isLiked: !recipe.isLiked }; // Yeni referans oluştur
      console.log(
        `${this.recipes[index].title} ${
          this.recipes[index].isLiked ? 'favorilere eklendi' : 'favorilerden çıkarıldı'
        }`
      );
    }
  }

  ngOnInit() {console.log();
  }

}
