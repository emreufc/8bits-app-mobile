import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService } from 'src/app/core/services/recipe.service';
import { RecipeSummary } from 'src/app/core/models/recipe';
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

  constructor(private router: Router,
              private recipeService: RecipeService
  ) { }

  async ngOnInit() {
    console.log('Home Page Initialized');
    await this.loadFavoriteRecipes(); // Favori tarifleri yükle
    this.loadRecipes(this.currentPage, this.pageSize); // Tarifleri yükle
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



    // Bu horizantal scroll cardları için
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
    
        if (recipe.favouriteRecipes) {
          this.favRecipeIds.push(recipe.recipeId); // Favorilere ekle
        } else {
          this.favRecipeIds = this.favRecipeIds.filter((id) => id !== recipe.recipeId); // Favorilerden çıkar
        }
      } catch (error) {
        recipe.favouriteRecipes = previousStatus; // Hata durumunda durumu geri al
        console.error(`Hata: ${recipe.recipeName} favori durumu değiştirilemedi`, error);
      }
    }
    

  
  goToRecipeDetail(recipeId: number) {
    this.router.navigate(['/content/recipe-detail', recipeId]);
    console.log('Tarife git');  
  }

  // Bu recipe-card component için
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
      } catch (error) {
        console.error(`Hata: ${recipe.recipeName} favori durumu güncellenemedi`, error);
      }
    }
  }



}
