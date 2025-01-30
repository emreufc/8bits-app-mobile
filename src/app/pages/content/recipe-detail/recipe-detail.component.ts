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
    this.loadData();
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

      console.log("this.recipeId", this.recipeId);
      const result = await this.recipeService.toggleOldRecipeStatus(this.recipeId);

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

  /**
 * Tarif ilk kez "Yaptığım tariflere ekle" dendiğinde burası çalışır.
 *  - Eğer hasEnoughIngredients = true ise malzemeleri düşmek vs. için confirm dialog sorar.
 *  - HasEnoughIngredients = false ise "Sepete ekleyelim mi?" vb. sorar.
 *  - Sonunda addOldRecipe() metodunu çağırarak tarifi "eski tarif" olarak işaretler (isOldRecipe = true).
 */
  async addToOldRecipes() {
    if (this.recipeDetail.isOldRecipe) {
      this.showToast('Bu tarif zaten "yaptığım tarifler" listesine ekli.', 'warning');
      return;
    }
  
    try {
      const hasEnoughIngredients = this.recipeDetail.hasEnoughIngredients;
      if (hasEnoughIngredients) {
        const deductIngredients = await this.confirmDialog(
          'Elinizde yeterli malzeme var. Tarifteki malzemeleri mutfağınızdan düşülsün mü?'
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
        // Malzeme yetersizse yine sepete eklemek ister misiniz?
        const addToShoppingList = await this.confirmDialog(
          'Elinizde bu tarif için yeterli malzeme yok. Alışveriş sepetine eklemek ister misiniz?'
        );
  
        if (addToShoppingList) {
          await this.addToShoppingCart();
          await this.addOldRecipe();
        } else {
          const proceedWithoutDeduction = await this.confirmDialog(
            'Eksik malzeme eklenmeden yine de tarifi "yaptığım tarifler" olarak eklemek istiyor musunuz?'
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
  

/**
 * "Tarifi Tekrar Yap" butonu. 
 *  - Yine `addToOldRecipes()` metodunu çağırarak aynı süreci yürütür,
 *    ancak tarif zaten oldRecipe listesinde ise toggle yapmaz ve uyarı verir.
 */
/**
 * "Tarifi Tekrar Yap" butonu.
 * Tarif zaten isOldRecipe = true durumunda.
 * Yalnızca malzeme kontrolü ve eksiltme/sepete ekleme sürecini tekrar uygular;
 * isOldRecipe durumunu korur (yani toggle etmez).
 */
async retryRecipe() {
  // Eğer tarif aslında henüz ekli değilse, önce eklenmesi gerekir.
  if (!this.recipeDetail.isOldRecipe) {
    this.showToast('Bu tarif henüz "yaptığım tarifler" arasında değil.', 'warning');
    return;
  }

  try {
    // Daha önce loadData() içinde recipeDetail.hasEnoughIngredients set edilmişti.
    const hasEnoughIngredients = this.recipeDetail.hasEnoughIngredients;
    
    if (hasEnoughIngredients) {
      const deductIngredients = await this.confirmDialog(
        'Elinizde yeterli malzeme var. Bir kez daha mutfaktan düşmek ister misiniz?'
      );

      if (deductIngredients) {
        await this.deductFromPantry(); 
        // Burada tarif zaten oldRecipe, o yüzden tekrar toggle etmiyoruz.
        this.showToast('Tarif yeniden yapıldı. Malzemeler tekrar mutfaktan düşüldü.', 'success');
      } else {
        const proceedWithoutDeduction = await this.confirmDialog(
          'Malzemeler düşülmeden sadece tarifi yeniden yapmak ister misiniz?'
        );
    
        if (proceedWithoutDeduction) {
          this.showToast('Tarif yeniden yapıldı. (Malzemeler düşülmedi.)', 'success');
        } else {
          this.showToast('İşlem iptal edildi.', 'danger');
        }
      }
    } else {
      // Malzeme yetersizse yine sepete eklemek ister misin diye soralım
      const addToShoppingList = await this.confirmDialog(
        'Elinizde tarif için yeterli malzeme yok. Eksikleri alışveriş sepetine eklemek ister misiniz?'
      );

      if (addToShoppingList) {
        await this.addToShoppingCart();
        this.showToast('Tarif yeniden yapıldı. Eksikler sepete eklendi.', 'success');
      } else {
        const proceedWithoutDeduction = await this.confirmDialog(
          'Yetersiz malzemeyle devam etmek istediğinize emin misiniz? (Malzeme düşülmeyecek.)'
        );

        if (proceedWithoutDeduction) {
          this.showToast('Tarif yeniden yapıldı. (Eksik malzemeler düşülmedi.)', 'success');
        } else {
          this.showToast('İşlem iptal edildi.', 'danger');
        }
      }
    }
  } catch (error) {
    console.error('Tarifi yeniden yapma sırasında hata:', error);
    this.showToast('Bir hata oluştu. Lütfen tekrar deneyin.', 'danger');
  }
}


/**
 * Tarif halihazırda "yapılmış" (isOldRecipe = true) ise bu metotla çıkarıyoruz.
 */
async removeFromOldRecipes() {
  if (!this.recipeDetail.isOldRecipe) {
    this.showToast('Tarif zaten "yaptığım tarifler" arasında kayıtlı değil.', 'warning');
    return;
  }

  try {
    await this.recipeService.toggleOldRecipeStatus(this.recipeId);
    this.recipeDetail.isOldRecipe = false;
    this.showToast('Tarif yaptığınız tariflerden çıkarıldı.', 'success');
  } catch (error) {
    console.error(error);
    this.showToast('Bir hata oluştu. Lütfen tekrar deneyin.', 'danger');
  }
}


/**
 * addToOldRecipes içindeki onaylardan sonra, gerçekten
 * "tarifi oldRecipe olarak" işaretlemek için bu metot çağrılır.
 * toggleOldRecipeStatus çağırırken `isOldRecipe`'yi doğrudan true'ya setleriz.
 */


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
    console.log("this.recipeId", this.recipeId);
    await this.recipeService.toggleOldRecipeStatus(this.recipeId);
  
    // Artık tarifi oldRecipe = true olarak işaretliyoruz.
    this.recipeDetail.isOldRecipe = true;
  
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
