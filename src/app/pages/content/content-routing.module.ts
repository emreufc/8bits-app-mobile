import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContentPage } from './content.page';

const routes: Routes = [
  {
    path: '',
    component: ContentPage,
    children: [
      {
        path: 'allergen-filter',
        loadChildren: () => import('./allergen-filter/allergen-filter.module').then( m => m.AllergenFilterPageModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
      },
      {
        path: 'diet-filter',
        loadChildren: () => import('./diet-filter/diet-filter.module').then( m => m.DietFilterPageModule)
      },
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'profile-edit',
        loadChildren: () => import('./profile-edit/profile-edit.module').then( m => m.ProfileEditPageModule)
      },
      {
        path: 'recipes/:id',
        loadChildren: () => import('./recipes/recipes.module').then( m => m.RecipesPageModule)
      },
      {
        path: 'search',
        loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
      },
      {
        path: 'shop-list',
        loadChildren: () => import('./shop-list/shop-list.module').then( m => m.ShopListPageModule)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }

    ]
  },
  


  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContentPageRoutingModule {}
