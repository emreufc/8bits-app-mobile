import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { RecipeService } from 'src/app/core/services/recipe.service';
import { Share } from '@capacitor/share';

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
    private toastController: ToastController
  ) {
    this.backgroundImage = '';
   }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.recipeId = id;
    this.recipeService.getRecipeDetail(Number(id)).then((result: any) => {
      console.log('Recipe Detail:', result);
      this.recipeDetail = result.data;
      this.recipeDetail.isFavourited = result.isFavourited;
      this.recipeDetail.isOldRecipe = result.isOldRecipe;
      this.backgroundImage = this.recipeDetail.imageUrl;

    });
    this.recipeService.getRecipeIngredients(Number(id)).then((result: any) => {
      console.log('Recipe Ingredients:', result);
      this.ingredients = result.data;
    });

    this.recipeService.getRecipeSteps(Number(id)).then((result: any) => {
      console.log('Recipe Steps:', result);
      this.steps = result.data;
    });
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
      console.log('Recipe ID:', this.recipeId);
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
}
