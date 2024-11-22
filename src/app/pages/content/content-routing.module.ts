import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContentPage } from './content.page';

const routes: Routes = [
  {
    path: '',
    component: ContentPage,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
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
        path: 'diet-filter',
        loadChildren: () => import('./diet-filter/diet-filter.module').then( m => m.DietFilterPageModule)
      },
      {
        path: 'allergen-filter',
        loadChildren: () => import('./allergen-filter/allergen-filter.module').then( m => m.AllergenFilterPageModule)
      },
      {
<<<<<<< HEAD
        path: 'search',
        loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
      },
    
=======
        path: 'profile-edit',
        loadChildren: () => import('./profile-edit/profile-edit.module').then( m => m.ProfileEditPageModule)
      },
>>>>>>> 81ddd0914e54b0f07bb54529caa4fca153ab4729
    ]
  },


  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContentPageRoutingModule {}
