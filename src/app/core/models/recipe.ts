export interface RecipeSummary {
  recipeId: number;
  recipeName: string | any;
  imageUrl: string | any;
  recipeRate: number | any;
  personCount: number | any;
  preparationTime: number | any;
  cookingTime: number | any;
  favouriteRecipes: boolean | any;
}

export interface OldRecipe {
  recipeId: number;
}