import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { RecipeService } from 'src/app/core/services/recipe.service';
import { environment } from 'src/environments/environment';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss'],
})
export class RecipeDetailComponent  implements OnInit {
  backgroundImage: string;
  public ingredients: any[] = [];

  public steps: any[] = [];
  segmentValue: string = 'ingredients';

  public otherRecipes: any[] = [];
  public recipeDetail: any;
  public summary: string = '';

  constructor(
    private navCtrl: NavController, 
    private route: ActivatedRoute,
    private recipeService: RecipeService,
  ) {
    this.backgroundImage = '';
   }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.recipeService.getRecipeDetail(Number(id)).then((result: any) => {
      this.recipeDetail = result.mainRecipe;
      this.otherRecipes = result.randomRecipes;
      
      this.steps = this.recipeDetail.preparationSteps;
      this.ingredients = this.recipeDetail.ingredients;

      this.backgroundImage = environment.apiUrl + this.recipeDetail.coverImageUrl;
      const idx = this.steps.findIndex((query) => query.type === 'summary');
      if (idx !== -1) {
        console.log(this.steps[idx]);
        this.summary = this.steps[idx].description;
        this.steps.splice(idx, 1);
      }
    });
  }

  closePage() {
    this.navCtrl.back();
  }

  public async share() {
    await Share.share({
      title: this.recipeDetail.title,
      text: 'Bu tarifi arkadaşlarınızla paylaşabilirsiniz.',
      url: 'https://app.glutensizada.com/',
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
}
