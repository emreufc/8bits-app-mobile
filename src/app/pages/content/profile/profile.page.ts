import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public userName: string = 'Name - Surname';
  public userLocation: string = 'New York, USA';
  public selectedSegment: string = 'old-recipes'; // Başlangıçta 'Old Recipes' seçili
  public favoriteRecipes: any = []; // Favoriler listesi

  recipes = [
    {
      id: 1,
      title: 'Vegetable Noodle',
      image: 'https://via.placeholder.com/400?text=Vegetable+Noodle',
      rating: 4.3,
      time: '20 min',
      servings: 2,
      isLiked: true,
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
      servings: 5,
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
      isLiked: true,
    }
  ];

  constructor(private router: Router, private navCtrl: NavController) {}

  ngOnInit() {
    console.log('Profile Page');
    this.updateFavoriteRecipes(); // Favori tarifleri hesapla
  }

  segmentChanged(event: any) {
    console.log('Segment değişti:', event.detail.value);
    this.selectedSegment = event.detail.value; // Hangi segment seçildiyse o değer atanır
    if (this.selectedSegment === 'favorites') {
      this.updateFavoriteRecipes(); // Favoriler güncellensin
    }
  }
  
  updateFavoriteRecipes() {
    this.favoriteRecipes = this.recipes.filter((recipe) => recipe.isLiked);
    console.log('Favori tarifler:', this.favoriteRecipes);
  }
  

  goToRecipeDetail(recipeId: number) {
    this.router.navigate(['/content/recipe-detail', recipeId]);
    console.log('Tarife git');
  }
  // Geri dönülmesi gerekilen sayfalarda bu tarz bir navigasyon öneriyorlardı o yüzden denedim. 
  // Gerekirse normal haline döneriz.
  editProfile() {
    this.navCtrl.navigateForward('/content/profile-edit', {
      animated: true,
      animationDirection: 'forward',
    });
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
      this.updateFavoriteRecipes(); // Favoriler listesini güncelle
    }
  }
  

  
}
