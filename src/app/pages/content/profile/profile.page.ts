import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonTabs, NavController, ToastController } from '@ionic/angular';
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
  oldRecipes: RecipeSummary[] = []; // Eski tarifler listesi
  recipes: RecipeSummary[] = []; // Tarif verileri

  user: User = {
      name: '',
      surname: '',
      // gender: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '',
      imageUrl: '',
    };

  userInitial: string = '?'; 
  userColor: string = '#95A5A6';

  constructor(private router: Router, 
              private navCtrl: NavController, 
              private recipeService: RecipeService,
              private userService: UserService,
              private alertController: AlertController,
              private toastController: ToastController,
              private tabs: IonTabs
            ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(
      (response: any) => {
        console.log('API Response:', response);
        // Yanıttaki data katmanından kullanıcı bilgilerini çek
        this.user = response.data;
        this.userInitial = this.getUserInitial(this.user.name);
        this.userColor = this.getColorByInitial(this.userInitial);
        console.log('Current Form Data:', this.user);
      },
      (error) => {
        console.error('Kullanıcı bilgileri alınamadı:', error);
      }
    );
    this.loadOldRecipes();

    
    console.log('User Initial:', this.userInitial);
    console.log('User Color:', this.userColor);
  }

  getUserInitial(name: string): string {
    console.log('Name:', name);
    return name ? name.charAt(0).toUpperCase() : '?'; // Ad yoksa '?' döner
  }

  getColorByInitial(initial: string): string {
    const colorMap: { [key: string]: string } = {
      A: '#FF5733', B: '#33FF57', C: '#3357FF', D: '#F39C12',
      E: '#8E44AD', F: '#3498DB', G: '#E74C3C', H: '#1ABC9C',
      I: '#9B59B6', J: '#E67E22', K: '#2ECC71', L: '#E74C3C',
      M: '#2C3E50', N: '#16A085', O: '#F1C40F', P: '#D35400',
      Q: '#2980B9', R: '#8E44AD', S: '#34495E', T: '#27AE60',
      U: '#7D3C98', V: '#1F618D', W: '#117A65', X: '#B03A2E',
      Y: '#784212', Z: '#1A5276'
    };
  
    return colorMap[initial] || '#95A5A6'; // Harf yoksa varsayılan bir renk döner
  }

  ngAfterViewInit() {  
    this.tabs.ionTabsDidChange.subscribe(async () => {
      if (this.isActiveTab()) {
        console.log('Aktif tab: profile');

        this.userService.getCurrentUser().subscribe(
          (response: any) => {
            this.user = response.data;
            this.userInitial = this.getUserInitial(this.user.name);
            this.userColor = this.getColorByInitial(this.userInitial);
          },
          (error) => {
            console.error('Kullanıcı bilgileri alınamadı:', error);
          }
        );
        this.loadOldRecipes();
      }
    });
  }

  isActiveTab() {
    return this.tabs.getSelected() === 'profile'; 
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
    } else if (this.selectedSegment === 'old-recipes') {
      this.loadOldRecipes(); // Eski tarifler güncellensin
    }
  }

  async loadOldRecipes() {
    try {
      const response = await this.recipeService.getOldRecipes();
      this.oldRecipes = response.data.map((recipe: any) => ({
        ...recipe,
        favouriteRecipes: false // Favori değil
      }));
      console.log('Eski tarifler yüklendi:', this.recipes);
    } catch (error) {
      console.error('Eski tarifler yüklenirken hata oluştu:', error);
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
