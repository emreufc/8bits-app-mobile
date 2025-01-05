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
    };

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
        console.log('Current Form Data:', this.user);
      },
      (error) => {
        console.error('Kullanıcı bilgileri alınamadı:', error);
      }
    );
    this.loadFavoriteRecipes();
    this.loadOldRecipes();
  }

  ngAfterViewInit() {  
    this.tabs.ionTabsDidChange.subscribe(async () => {
      if (this.isActiveTab()) {
        console.log('Aktif tab: profile');

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
        this.loadFavoriteRecipes();
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
  
      // Sunucudan gelen verileri kopyala ve ters çevir
      const reversedData = [...response.data].reverse();
  
      this.favoriteRecipes = reversedData.map((recipe: any) => ({
        ...recipe,
        favouriteRecipes: true // Favori durumunu ekle
      }));
      console.log('Favori tarifler yüklendi:', this.favoriteRecipes);
    } catch (error) {
      console.error('Favori tarifler yüklenirken hata oluştu:', error);
    }
  }
  
  async loadOldRecipes() {
    try {
      const response = await this.recipeService.getOldRecipes();
  
      // Eski tariflerin verisini de ters çevir
      const reversedData = [...response.data].reverse();
  
      this.oldRecipes = reversedData.map((recipe: any) => {
        // 'this.favoriteRecipes' içinde recipe.recipeId var mı diye kontrol et
        const isFavourite = this.favoriteRecipes?.some(
          (fav: any) => fav.recipeId === recipe.recipeId
        );
  
        return {
          ...recipe,
          favouriteRecipes: !!isFavourite
        };
      });
  
      console.log('Eski tarifler yüklendi:', this.oldRecipes);
    } catch (error) {
      console.error('Eski tarifler yüklenirken hata oluştu:', error);
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
    // Önce hem favoriteRecipes hem de oldRecipes dizilerinde arıyoruz
    const favIndex = this.favoriteRecipes.findIndex(r => r.recipeId === recipeId);
    const oldIndex = this.oldRecipes.findIndex(r => r.recipeId === recipeId);
  
    // Eğer hiçbirinde yoksa herhangi bir işlem yapmaya gerek yok
    if (favIndex === -1 && oldIndex === -1) {
      console.log('Bu tarif, favorilerde veya eski tariflerde bulunamadı:', recipeId);
      return;
    }
  
    // Hangisinde bulduysak oradaki “favouriteRecipes” değerine bakarak yeni durumu belirliyoruz.
    // Örneğin önce favorilerde bulduysak onun newStatus’una göre işlem yapacağız;
    // yoksa oldRecipes listesindekinin durumu esas alınacak.
    let newStatus: boolean;
    let recipeName: string;
  
    if (favIndex !== -1) {
      // Eğer favori listesinde bulduysak
      const recipe = this.favoriteRecipes[favIndex];
      newStatus = !recipe.favouriteRecipes;
      recipeName = recipe.recipeName;
    } else {
      // Yoksa eski tarifler listesinde bulduk
      const recipe = this.oldRecipes[oldIndex];
      newStatus = !recipe.favouriteRecipes;
      recipeName = recipe.recipeName;
    }
  
    try {
      // API'ye istek gönderip sunucu tarafında da favori durumunu güncelliyoruz
      await this.recipeService.favRecipe(newStatus, recipeId);
  
      if (!newStatus) {
        // Favorilikten çıkarma
        if (favIndex !== -1) {
          // Favoriler dizisinden o tarifi kaldırıyoruz
          this.favoriteRecipes.splice(favIndex, 1);
        }
        // oldRecipes içinde varsa “favouriteRecipes”i false yapıyoruz
        if (oldIndex !== -1) {
          this.oldRecipes[oldIndex].favouriteRecipes = false;
        }
  
        console.log(`${recipeName} favorilerden çıkarıldı.`);
        const toast = await this.toastController.create({
          message: `${recipeName} favorilerden çıkarıldı.`,
          duration: 1000,
          position: 'bottom',
          color: 'warning',
        });
        await toast.present();
      } else {
        // Favoriye ekleme
        // Eğer favorilerde yoksa (favIndex === -1) ama oldRecipes'te varsa oradakini favori olarak ekleyebiliriz.
        if (favIndex === -1 && oldIndex !== -1) {
          // oldRecipes’teki kaydı kopyalayıp favoriteRecipes'e ekliyoruz
          this.favoriteRecipes.push({
            ...this.oldRecipes[oldIndex],
            favouriteRecipes: true
          });
        } else if (favIndex !== -1) {
          // Zaten favoriteRecipes içinde ise sadece durumu true yapıyoruz
          this.favoriteRecipes[favIndex].favouriteRecipes = true;
        }
  
        // oldRecipes dizisinde de bulduysak onu true yap
        if (oldIndex !== -1) {
          this.oldRecipes[oldIndex].favouriteRecipes = true;
        }
  
        console.log(`${recipeName} favorilere eklendi.`);
        const toast = await this.toastController.create({
          message: `${recipeName} favorilere eklendi.`,
          duration: 1000,
          position: 'bottom',
          color: 'success',
        });
        await toast.present();
      }
    } catch (error) {
      console.error(`Hata: ${recipeName} favori durumu değiştirilemedi`, error);
      const alert = await this.alertController.create({
        header: 'Hata',
        message: `${recipeName} favori durumu değiştirilemedi. Lütfen tekrar deneyin.`,
        buttons: ['Tamam'],
      });
      await alert.present();
    }
  }
  
}
