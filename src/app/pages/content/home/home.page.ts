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
  filteredRecipes: any[] = [];
  matchedRecipes: any[] = [];
  loadingMatchedRecipes = true; // Mutfağa uygun Verinin yüklenme durumunu takip eder
  currentFilter: string = 'hepsi'; // Varsayılan olarak 'hepsi'
  chips: string[] = ['Hepsi', 'Kahvalti', 'Oglen', 'Aksam', 'Tatli', 'Icecek'];
  currentSearchKeyword: string = ''; // Arama anahtar kelimesi


  @ViewChild('header') header!: HeaderComponent;

  constructor(private router: Router,
              private recipeService: RecipeService,
              private toastController: ToastController,
              private alertController: AlertController,
              private tabs: IonTabs
  ) { }

  async ngOnInit() {
    await this.loadFavoriteRecipes(); // Favori tarifleri yükle
    await this.loadMatchedRecipes(this.currentPage, this.pageSize);
    this.loadRecipes(this.currentPage, this.pageSize); // Tarifleri yükle
  }
  

  ngAfterViewInit() {  
    this.tabs.ionTabsDidChange.subscribe(async () => {
      if (this.isActiveTab()) {
        this.header?.loadUser();
        await this.loadFavoriteRecipes(); // Favori tarifleri yükle
        await this.loadMatchedRecipes(this.currentPage, this.pageSize);
        this.loadRecipes(this.currentPage, this.pageSize); // Tarifleri yükle
      }
    });
  }

  onSearch(keyword: string) {
    this.currentSearchKeyword = keyword; // Arama anahtar kelimesini sakla
    if (keyword) {
      this.recipeService.getSearchedRecipes(keyword, this.currentPage, 20).subscribe(
        (response) => {
          this.recipes = response.data; // Gelen tarifleri recipes değişkenine aktar
          console.log('Arama sonuçları:', this.recipes);
        },
        (error) => {
          console.error('Error fetching searched recipes:', error);
          this.recipes = [];
          this.showNoResultsAlert();
        }
      );
    } else {
      this.loadRecipes(); // Kullanıcı arama çubuğunu temizlediğinde varsayılan tarifleri yükle
    }
  }

  clearSearch(): void {
    this.currentSearchKeyword = ''; // Arama kelimesini sıfırla
    this.loadRecipes(); // Varsayılan tarifleri yükle
  }

  showNoResultsAlert(): void {
    // Kullanıcıya alert göstermek için
    const alert = document.createElement('ion-alert');
    alert.header = 'Tarif Bulunamadı';
    alert.message = `Aradığınız "${this.currentSearchKeyword}" ile eşleşen bir tarif bulunamadı.`;
    alert.buttons = [
      {
        text: 'Tamam',
        handler: () => {
          this.clearSearch(); // Kullanıcı "Tamam" dediğinde aramayı temizle
        },
      },
    ];
  
    document.body.appendChild(alert);
    alert.present();
  }

  isActiveTab() {
    return this.tabs.getSelected() === 'home'; // Aktif tab'ı kontrol et
  }

  loadMoreRecipes(event: any): void {
    this.currentPage++; // Sayfa numarasını artır
  
    if (this.currentSearchKeyword) {
      // Eğer arama yapılıyorsa
      this.recipeService.getSearchedRecipes(this.currentSearchKeyword, this.currentPage, this.pageSize).subscribe(
        (response) => {
          this.recipes = [...this.recipes, ...response.data]; // Yeni tarifleri mevcut tariflere ekle
          this.pagination = response.pagination; // Sayfalama bilgileri
          event.target.complete(); // Sonsuz kaydırma olayını tamamla
        },
        (error) => {
          console.error('Arama sonuçları yüklenirken hata:', error);
          event.target.complete(); // Hata durumunda da olay tamamlanır
          event.target.disabled = true; // Hata durumunda infinite scroll'u deaktif et
        }
      );
    } else if (this.currentFilter === 'hepsi') {
      // "Hepsi" seçiliyse tüm tarifleri yükle
      this.recipeService.getRecipes(this.currentPage, this.pageSize).subscribe(
        (response) => {
          this.recipes = [...this.recipes, ...response.data]; // Yeni tarifleri mevcut tariflere ekle
          this.pagination = response.pagination; // Sayfalama bilgileri
          event.target.complete(); // Sonsuz kaydırma olayını tamamla
        },
        (error) => {
          console.error('Tüm tarifler yüklenirken hata:', error);
          event.target.complete(); // Hata durumunda da olay tamamlanır
        }
      );
    } else {
      // Filtre seçiliyse filtreye göre tarifleri yükle
      this.recipeService.getFilteredRecipes(this.currentFilter, this.currentPage, this.pageSize).subscribe(
        (response) => {
          this.recipes = [...this.recipes, ...response.data]; // Yeni tarifleri mevcut tariflere ekle
          this.pagination = response.pagination; // Sayfalama bilgileri
          event.target.complete(); // Sonsuz kaydırma olayını tamamla
        },
        (error) => {
          console.error('Filtrelenmiş tarifler yüklenirken hata:', error);
          event.target.complete(); // Hata durumunda da olay tamamlanır
        }
      );
    }
  }
  
  async loadFavoriteRecipes() {
    try {
      const response = await this.recipeService.getFavRecipes();
      this.favRecipeIds = response.data.map((fav: any) => fav.recipeId) || []; // Favori tariflerin ID'lerini al
    } catch (error) {
      console.error('Favori tarifler yüklenirken hata oluştu:', error);
      this.favRecipeIds = []; // Hata durumunda boş liste
    }
  }
  

  onFilterChange(filter: string): void {
    this.currentFilter = filter.toLowerCase(); // Filtreyi küçük harfe çevir
    this.loadRecipes(); // Filtreye göre tarifleri yükle
  }
  

  loadRecipes(pageNumber: number = 1, pageSize: number = 10): void {
    if (this.currentFilter === 'hepsi') {
      // Tüm tarifler için
      this.recipeService.getRecipes(pageNumber, pageSize).subscribe(
        (response) => {
          this.recipes = response.data.map((recipe: any) => ({
            ...recipe,
            favouriteRecipes: this.favRecipeIds.includes(recipe.recipeId) // Favori kontrolü
          }));
          this.pagination = response.pagination; // Sayfalama bilgileri
        },
        (error) => {
          console.error('Error fetching recipes:', error);
        }
      );
    } else {
      this.recipeService.getFilteredRecipes(this.currentFilter, pageNumber, pageSize).subscribe(
        (response) => {
          console.log('Filtrelenmiş tarifler:', response.data);
          this.recipes = response.data.map((recipe: any) => ({
            ...recipe,
            favouriteRecipes: this.favRecipeIds.includes(recipe.recipeId) // Favori kontrolü
          }));
          this.pagination = response.pagination; // Sayfalama bilgileri
        },
        (error) => {
          console.error('Error fetching filtered recipes:', error);
        }
      );
    }
  }

  loadMatchedRecipes(pageNumber: number, pageSize: number) {
    this.recipeService.getMatchedRecipes(pageNumber, pageSize).subscribe(
      (response) => {
        this.matchedRecipes = response.data.map((recipe: any) => ({
          ...recipe,
          favouriteRecipes: this.favRecipeIds.includes(recipe.recipeId) // Favori kontrolü
        }));
        this.loadingMatchedRecipes = false; // Veri gerçekten geldi, loading = false
        this.pagination = response.pagination; // Sayfalama bilgileri
      },
      (error) => {
        console.error('Error fetching recipes:', error);
        this.loadingMatchedRecipes = false; // Hata da alsak loading’i kapat
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
