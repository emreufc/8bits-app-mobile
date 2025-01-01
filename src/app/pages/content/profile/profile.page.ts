import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { RecipeService } from 'src/app/core/services/recipe.service';
import { RecipeSummary } from 'src/app/core/models/recipe';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/core/models/user';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public userLocation: string = 'New York, USA';
  public selectedSegment: string = 'old-recipes'; // Başlangıçta 'Old Recipes' seçili
  favoriteRecipes: RecipeSummary[] = []; // Favoriler listesi
  recipes: RecipeSummary[] = []; // Tarif verileri

  user: User = {
      name: '',
      surname: '',
      // gender: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '',
    };
    
  // recipes = [
  //   {
  //     id: 1,
  //     title: 'Vegetable Noodle',
  //     image: 'https://via.placeholder.com/400?text=Vegetable+Noodle',
  //     rating: 4.3,
  //     time: '20 min',
  //     servings: 2,
  //     isLiked: true,
  //   },
  //   {
  //     id: 2,
  //     title: 'Chicken Curry',
  //     image: 'https://via.placeholder.com/400?text=Chicken+Curry',
  //     rating: 4.8,
  //     time: '45 min',
  //     servings: 4,
  //     isLiked: false,
  //   },
  //   {
  //     id: 3,
  //     title: 'Beef Stroganoff',
  //     image: 'https://via.placeholder.com/400?text=Beef+Stroganoff',
  //     rating: 4.5,
  //     time: '30 min',
  //     servings: 3,
  //     isLiked: false,
  //   },
  //   {
  //     id: 4,
  //     title: 'Spaghetti Bolognese',
  //     image: 'https://via.placeholder.com/400?text=Spaghetti+Bolognese',
  //     rating: 4.7,
  //     time: '40 min',
  //     servings: 5,
  //     isLiked: false,
  //   },
  //   {
  //     id: 5,
  //     title: 'Grilled Salmon',
  //     image: 'https://via.placeholder.com/400?text=Grilled+Salmon',
  //     rating: 4.9,
  //     time: '25 min',
  //     servings: 2,
  //     isLiked: false,
  //   },
  //   {
  //     id: 6,
  //     title: 'Caesar Salad',
  //     image: 'https://via.placeholder.com/400?text=Caesar+Salad',
  //     rating: 4.2,
  //     time: '15 min',
  //     servings: 3,
  //     isLiked: true,
  //   }
  // ];

  constructor(private router: Router, 
              private navCtrl: NavController, 
              private recipeService: RecipeService,
              private userService: UserService,
              private alertController: AlertController,
              private toastController: ToastController) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(
      (response: any) => {
        console.log('API Response:', response);
        // Yanıttaki data katmanından kullanıcı bilgilerini çek
        this.user = response.data;
        console.log('Current Form Data:', this.user);
      },
      (error) => {
        console.error('Kullanıcı bilgileri alınamadı:', error);
      }
    );
  }

  async loadFavoriteRecipes() {
    try {
      const response = await this.recipeService.getFavRecipes();
      this.favoriteRecipes = response.data.map((recipe: any) => ({
        ...recipe,
        favouriteRecipes: true // Favori durumunu ekle
      }));
      console.log('Favori tarifler yüklendi:', this.favoriteRecipes);
    } catch (error) {
      console.error('Favori tarifler yüklenirken hata oluştu:', error);
    }
  }
  

  segmentChanged(event: any) {
    console.log('Segment değişti:', event.detail.value);
    this.selectedSegment = event.detail.value; // Hangi segment seçildiyse o değer atanır
    if (this.selectedSegment === 'favorites') {
      this.loadFavoriteRecipes(); // Favoriler güncellensin
    }
  }
  
  // updateFavoriteRecipes() {
  //   this.favoriteRecipes = this.recipes.filter((recipe) => recipe.favouriteRecipes);
  //   console.log('Favori tarifler:', this.favoriteRecipes);
  // }
  

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
  

  async handleLikeToggled(recipeId: number) {
    const recipeIndex = this.favoriteRecipes.findIndex((recipe) => recipe.recipeId === recipeId);
  
    if (recipeIndex !== -1) {
      const recipe = this.favoriteRecipes[recipeIndex];
      const newStatus = !recipe.favouriteRecipes;
  
      try {
        // API'ye isteği gönder
        await this.recipeService.favRecipe(newStatus, recipeId);
  
        if (!newStatus) {
          // Eğer tarif favorilerden çıkarıldıysa, favori listesinden kaldır
          this.favoriteRecipes.splice(recipeIndex, 1); // Listeyi güncelle
          console.log(`${recipe.recipeName} favorilerden çıkarıldı ve listeden kaldırıldı.`);
  
          // Başarılı toast mesajı
          const toast = await this.toastController.create({
            message: `${recipe.recipeName} favorilerden çıkarıldı.`,
            duration: 1000, // Mesajın görünme süresi
            position: 'bottom',
            color: 'warning',
          });
          await toast.present();
        } else {
          console.log(`${recipe.recipeName} favorilere eklendi.`);
  
          // Başarılı toast mesajı
          const toast = await this.toastController.create({
            message: `${recipe.recipeName} favorilere eklendi.`,
            duration: 1000,
            position: 'bottom',
            color: 'success',
          });
          await toast.present();
        }
      } catch (error) {
        console.error(`Hata: ${recipe.recipeName} favori durumu değiştirilemedi`, error);
  
        // Hata alert mesajı
        const alert = await this.alertController.create({
          header: 'Hata',
          message: `${recipe.recipeName} favori durumu değiştirilemedi. Lütfen tekrar deneyin.`,
          buttons: ['Tamam'],
        });
        await alert.present();
      }
    }
  }
}
