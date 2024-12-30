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
  pagination: any = {};
  currentPage: number = 1; // Varsayılan ilk sayfa
  pageSize: number = 10; // Varsayılan sayfa başına öğe sayısı

  // recipes = [
  //   {
  //     id: 1,
  //     title: 'Vegetable Noodle',
  //     image: 'https://via.placeholder.com/400?text=Vegetable+Noodle',
  //     rating: 4.3,
  //     time: '20 min',
  //     servings: 2,
  //     isLiked: false,
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
  //     servings: 5, // Ensure this is a number
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
  //     isLiked: false,
  //   }
  // ];

  constructor(private router: Router,
              private recipeService: RecipeService
  ) { }

  ngOnInit() {
    this.loadRecipes(this.currentPage, this.pageSize);
  }
  
  loadRecipes(pageNumber: number, pageSize: number) {
    this.recipeService.getRecipes(pageNumber, pageSize).subscribe(
      (response) => {
        this.recipes = response.data; // Tarif verileri
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




    // Kalp durumunu değiştirir
    toggleLike(recipe: any, event: Event) {
      event.stopPropagation(); // Event'in parent elementlere yayılmasını durdur
      recipe.favouriteRecipes = !recipe.favouriteRecipes;
      console.log(`${recipe.recipeName} durumu: ${recipe.favouriteRecipes ? 'Beğenildi' : 'Beğenilmedi'}`);
    }

  
  goToRecipeDetail(recipeId: number) {
    this.router.navigate(['/content/recipe-detail', recipeId]);
    console.log('Tarife git');  
  }

  handleLikeToggled(recipeId: number) {
    const index = this.recipes.findIndex((r) => r.recipeId === recipeId);
    if (index !== -1) {
      const recipe = this.recipes[index];
      this.recipes[index] = { ...recipe, favouriteRecipes: !recipe.favouriteRecipes }; // Yeni referans oluştur
      console.log(
        `${this.recipes[index].recipeName} ${
          this.recipes[index].favouriteRecipes ? 'favorilere eklendi' : 'favorilerden çıkarıldı'
        }`
      );
    }
  }



}
