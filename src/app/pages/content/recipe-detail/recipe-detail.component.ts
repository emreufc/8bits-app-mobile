import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, IonTabs, NavController, ToastController } from '@ionic/angular';
import { RecipeService } from 'src/app/core/services/recipe.service';
import { Share } from '@capacitor/share';
import { OldRecipe } from 'src/app/core/models/recipe';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss'],
})
export class RecipeDetailComponent  implements OnInit {
  backgroundImage: string;
  public ingredients: any[] = [];
  recipeId: any;

  public steps: any[] = [];
  segmentValue: string = 'ingredients';

  public otherRecipes: any[] = [];
  public recipeDetail: any;
  public summary: string = '';

  constructor(
    private navCtrl: NavController, 
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private toastController: ToastController,
    private alertController: AlertController,
    private tabs: IonTabs,
    private cdr: ChangeDetectorRef
  ) {
    this.backgroundImage = '';
   }

  ngOnInit() {
    // this.loadData();
  } 

  async loadData() {
    const id = this.route.snapshot.paramMap.get('id');
    this.recipeId = id;
    this.recipeService.getRecipeDetail(Number(id)).then((result: any) => {
      this.recipeDetail = result.data;
      this.recipeDetail.isFavourited = result.isFavourited;
      this.recipeDetail.isOldRecipe = result.isOldRecipe;
      this.backgroundImage = this.recipeDetail.imageUrl;
      this.cdr.detectChanges();
    });
    await this.recipeService.getRecipeIngredients(Number(id)).then((result: any) => {
      this.ingredients = result.data;
    });

    await this.recipeService.getRecipeSteps(Number(id)).then((result: any) => {
      this.steps = result.data;
    });

    await this.recipeService.checkIngredients(Number(id)).then((result: any) => {
      this.recipeDetail.hasEnoughIngredients = result.isSufficient;
      this.recipeDetail.missingIngredients = result.data;
    });
    await this.updateIngredientsMissingStatus();
    
    console.log('ingredients:', this.ingredients);
    console.log('missingIngredients:', this.recipeDetail.missingIngredients);
  }

  updateIngredientsMissingStatus() {
    if (this.recipeDetail && this.recipeDetail.missingIngredients) {
      this.ingredients.forEach(ingredient => {
        ingredient.isMissing = this.recipeDetail.missingIngredients.some((missingIngredient: any) => {
          return missingIngredient.ingredientId === ingredient.ingredientId;
        });
      });
    } else {
      // Eğer missingIngredients verisi yoksa, tüm malzemeleri 'isMissing' false yapabiliriz
      this.ingredients.forEach(ingredient => {
        ingredient.isMissing = false;
      });
    }
  }
  ngAfterViewInit() {  
    this.tabs.ionTabsDidChange.subscribe(async () => {
      if (this.isActiveTab()) {
        this.loadData();
      }
    });
  }

  isActiveTab() {
    return this.tabs.getSelected() === 'recipe-detail'; 
  }
  

  closePage() {
    this.navCtrl.back();
  }

  public async share() {
    await Share.share({
      title: this.recipeDetail.title,
      text: 'Bu tarifi arkadaşlarınızla paylaşabilirsiniz.',
      url: 'https://github.com/emreufc/8bits-app-mobile',
    });
  }


  public fav() {
    this.recipeDetail.isFavourited = !this.recipeDetail.isFavourited;

    const id = this.recipeDetail.id ? this.recipeDetail.id : this.recipeDetail.recipeId;

    if (this.recipeDetail.isFavourited) {
      this.recipeService.favRecipe(true, Number(id));
    } else {
      this.recipeService.favRecipe(false, Number(id));
    }
  }

  async toggleRecipeStatus() {
    try {
      // Servise istek gönder
      const oldRecipe: OldRecipe = {
        recipeId: (this.recipeId as number),
      }
      const result = await this.recipeService.toggleOldRecipeStatus(oldRecipe);

      // Durumu güncelle
      this.recipeDetail.isOldRecipe = !this.recipeDetail.isOldRecipe;

      // Başarı mesajı
      const toast = await this.toastController.create({
        message: this.recipeDetail.isOldRecipe
          ? 'Tarif yapıldı olarak kaydedildi.'
          : 'Tarif yapılmamış olarak kaydedildi.',
        duration: 2000, // Mesaj 2 saniye görünecek
        color: 'success', // Yeşil renk
        position: 'bottom', // Mesajın konumu
      });
      await toast.present();
    } catch (error) {
      console.error(error);

      // Hata mesajı
      const toast = await this.toastController.create({
        message: 'Bir hata oluştu. Lütfen tekrar deneyin.',
        duration: 2000,
        color: 'danger', // Kırmızı renk
        position: 'bottom',
      });
      await toast.present();
    }
  }

  async addToOldRecipes() {
    try {
      const hasEnoughIngredients = this.recipeDetail.hasEnoughIngredients;
      if (hasEnoughIngredients) {
        const deductIngredients = await this.confirmDialog(
          'Elinizde yeterli malzeme var. Tarifteki malzemeleri mutfağınızdan düşülerek mi devam edilsin?'
        );
  
        if (deductIngredients) {
          await this.deductFromPantry(); 
          await this.addOldRecipe(); 
        } else {
          const proceedWithoutDeduction = await this.confirmDialog(
            'Malzeme düşmeden sadece tarifinize eklemek istiyor musunuz?'
          );
      
          if (proceedWithoutDeduction) {
            await this.addOldRecipe(); 
          } else {
            this.showToast('İşlem iptal edildi.', 'danger'); 
          }
        }
      } else {
        const addToShoppingList = await this.confirmDialog(
          'Elinizde bu tarif için yeterli malzeme yok. Alışveriş sepetine ekleyerek devam etmek ister misiniz?'
        );
  
        if (addToShoppingList) {
          await this.addToShoppingCart();
        } else {
          const proceedWithoutDeduction = await this.confirmDialog(
            'Mutfağınızdaki malzemelerden eksiltmeden işleminize devam etmek ister misiniz?'
          );
  
          if (proceedWithoutDeduction) {
            await this.addOldRecipe();
          } else {
            this.showToast('İşlem iptal edildi.', 'danger'); 
          }
        }
      }
    } catch (error) {
      console.error(error);
      this.showToast('Bir hata oluştu. Lütfen tekrar deneyin.', 'danger');
    }
  }
  
  async retryRecipe() {
    await this.addToOldRecipes();
  }
  
  async removeFromOldRecipes() {
    try {
      await this.recipeService.toggleOldRecipeStatus({ recipeId: this.recipeId });
      this.recipeDetail.isOldRecipe = false;
      this.showToast('Tarif yaptığınız tariflerden çıkarıldı.', 'success');
    } catch (error) {
      console.error(error);
      this.showToast('Bir hata oluştu. Lütfen tekrar deneyin.', 'danger');
    }
  }

  async checkIngredients(): Promise<boolean> {
    const result = await this.recipeService.checkIngredients(this.recipeId);
    return result.data.hasEnoughIngredients;
  }
  
  async deductFromPantry(): Promise<void> {
    await this.recipeService.deductIngredients(this.recipeId).then(() => {
      this.showToast('Malzemeler mutfaktan düşüldü.', 'success');
    }).catch((error) => {
      this.showToast('Malzemeler düşülürken bir hata oluştu.', 'danger');
    });
    
  }
  
  async addToShoppingCart(): Promise<void> {
    try {
      const missingIngredients = this.recipeDetail.missingIngredients;
  
      for (const ingredient of missingIngredients) {
        
        await this.recipeService.addToShoppingCart(ingredient); 
      }
  
      this.showToast('Eksikler alışveriş sepetine eklendi.', 'success');
      this.routeToShoppingCart();
    } catch (error) {
      console.error(error);
      this.showToast('Eksikler alışveriş sepetine eklenirken bir hata oluştu.', 'danger');
    }
  }
  
  async addOldRecipe(): Promise<void> {
    await this.recipeService.toggleOldRecipeStatus({ recipeId: this.recipeId });
    this.recipeDetail.isOldRecipe = !this.recipeDetail.isOldRecipe;
    this.showToast('Tarif yaptığınız tariflere eklendi.', 'success');
  }
  
  routeToShoppingCart(): void {
    this.navCtrl.navigateForward('/content/shop-list');
  }
  
  async confirmDialog(message: string): Promise<boolean> {
    const alert = await this.alertController.create({
      header: 'Onay',
      message,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Hayır',
          role: 'cancel',
          handler: () => false,
        },
        {
          text: 'Evet',
          handler: () => true,
        },
      ],
    });
  
    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role !== 'cancel';
  }
  
  async showToast(message: string, color: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}
