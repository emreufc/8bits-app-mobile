import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService } from 'src/app/core/services/recipe.service';
import { RecipeSummary } from 'src/app/core/models/recipe';
import { AlertController, IonTabs, ToastController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  isLiked: boolean = false; // Varsayılan olarak içi boş kalp
  recipes: RecipeSummary[] = []; // Tarif verileri
  favRecipeIds: number[] = []; // Favori tariflerin ID'leri
  pagination: any = {};
  currentPage: number = 1; // Varsayılan ilk sayfa
  pageSize: number = 10; // Varsayılan sayfa başına öğe sayısı

  @ViewChild('header') header!: HeaderComponent;

  constructor(private router: Router,
              private recipeService: RecipeService,
              private toastController: ToastController,
              private alertController: AlertController,
              private tabs: IonTabs
  ) { }

  async ngOnInit() {
  }
  

  ngAfterViewInit() {  
    this.tabs.ionTabsDidChange.subscribe(async () => {
      if (this.isActiveTab()) {
        this.header?.loadUser();
        await this.loadFavoriteRecipes(); // Favori tarifleri yükle
        this.loadRecipes(this.currentPage, this.pageSize); // Tarifleri yükle
      }
    });
  }

  isActiveTab() {
    return this.tabs.getSelected() === 'home'; // Aktif tab'ı kontrol et
  }
  
  async loadFavoriteRecipes() {
    try {
      const response = await this.recipeService.getFavRecipes();
      console.log('API Yanıtı:', response); // Yanıtı loglayın
      this.favRecipeIds = response.data.map((fav: any) => fav.recipeId) || []; // Favori tariflerin ID'lerini al
      console.log('Favori tarifler yüklendi:', this.favRecipeIds);
    } catch (error) {
      console.error('Favori tarifler yüklenirken hata oluştu:', error);
      this.favRecipeIds = []; // Hata durumunda boş liste
    }
  }
  
  

  loadRecipes(pageNumber: number, pageSize: number) {
    this.recipeService.getRecipes(pageNumber, pageSize).subscribe(
      (response) => {
        this.recipes = response.data.map((recipe: any) => ({
          ...recipe,
          favouriteRecipes: this.favRecipeIds.includes(recipe.recipeId) // Favori kontrolü
        }));
        this.pagination = response.pagination; // Sayfalama bilgileri
        console.log('Recipes:', this.recipes);
        console.log('Pagination:', this.pagination);
      },
      (error) => {
        console.error('Error fetching recipes:', error);
      }
    );
  }
  

  loadMoreRecipes(event: any) {
    this.currentPage++; // Sayfa numarasını artır
    this.recipeService.getRecipes(this.currentPage, this.pageSize).subscribe(
      (response) => {
        this.recipes = [...this.recipes, ...response.data]; // Yeni tarifleri mevcut tariflere ekle
        this.pagination = response.pagination; // Sayfalama bilgileri
        console.log('Recipes:', this.recipes);
        console.log('Pagination:', this.pagination);
        event.target.complete(); // Sonsuz kaydırma olayını tamamla
      },
      (error) => {
        console.error('Error fetching recipes:', error);
        event.target.complete(); // Hata durumunda da sonsuz kaydırma olayını tamamla
      }
    );
  }


  
  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.loadRecipes(this.currentPage, this.pageSize);
  }

  /**
   * Handles page size change event.
   * @param newSize The new page size.
   */
  onPageSizeChange(newSize: number) {
    this.pageSize = newSize;
    this.loadRecipes(this.currentPage, this.pageSize);
  }



  async toggleLike(recipe: any, event: Event) {
    event.stopPropagation(); // Event'in parent elementlere yayılmasını durdur
  
    const previousStatus = recipe.favouriteRecipes; // Mevcut favori durumu
    recipe.favouriteRecipes = !previousStatus; // Durumu değiştir
  
    try {
      await this.recipeService.favRecipe(recipe.favouriteRecipes, recipe.recipeId);
      console.log(
        `${recipe.recipeName} ${
          recipe.favouriteRecipes ? 'favorilere eklendi' : 'favorilerden çıkarıldı'
        }`
      );
  
      // Toast mesajı göster
      const toast = await this.toastController.create({
        message: `${recipe.recipeName} ${
          recipe.favouriteRecipes ? 'favorilere eklendi' : 'favorilerden çıkarıldı'
        }.`,
        duration: 1000,
        position: 'bottom',
        color: recipe.favouriteRecipes ? 'success' : 'warning',
      });
      await toast.present();
  
      if (recipe.favouriteRecipes) {
        this.favRecipeIds.push(recipe.recipeId); // Favorilere ekle
      } else {
        this.favRecipeIds = this.favRecipeIds.filter((id) => id !== recipe.recipeId); // Favorilerden çıkar
      }
    } catch (error) {
      recipe.favouriteRecipes = previousStatus; // Hata durumunda durumu geri al
      console.error(`Hata: ${recipe.recipeName} favori durumu değiştirilemedi`, error);
  
      // Alert mesajı göster
      const alert = await this.alertController.create({
        header: 'Hata',
        message: `${recipe.recipeName} favori durumu değiştirilemedi. Lütfen tekrar deneyin.`,
        buttons: ['Tamam'],
      });
      await alert.present();
    }
  }
  
    

  
  goToRecipeDetail(recipeId: number) {
    this.router.navigate(['/content/recipe-detail', recipeId]);
    console.log('Tarife git');  
  }

  async handleLikeToggled(recipeId: number) {
    const recipeIndex = this.recipes.findIndex((recipe) => recipe.recipeId === recipeId);
  
    if (recipeIndex !== -1) {
      const recipe = this.recipes[recipeIndex];
      const newStatus = !recipe.favouriteRecipes;
  
      // API'ye isteği gönder
      try {
        await this.recipeService.favRecipe(newStatus, recipeId);
        this.recipes[recipeIndex].favouriteRecipes = newStatus; // UI güncellemesi
        console.log(`${recipe.recipeName} favori durumu güncellendi.`);
  
        // Başarı durumu için Toast mesajı
        const toast = await this.toastController.create({
          message: `${recipe.recipeName} favorilere ${newStatus ? 'eklendi' : 'çıkarıldı'}.`,
          duration: 1000,
          position: 'bottom',
          color: newStatus ? 'success' : 'warning',
        });
        await toast.present();
      } catch (error) {
        console.error(`Hata: ${recipe.recipeName} favori durumu güncellenemedi`, error);
  
        // Hata durumu için Alert mesajı
        const alert = await this.alertController.create({
          header: 'Hata',
          message: `${recipe.recipeName} favori durumu güncellenirken bir hata oluştu. Lütfen tekrar deneyin.`,
          buttons: ['Tamam'],
        });
        await alert.present();
      }
    }
  }
  
  ngOnDesroy() {
    console.log('Home Page Destroyed');
  }
}
