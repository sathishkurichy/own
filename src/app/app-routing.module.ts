import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RecipeModule } from '../domains/RecipeManagement/recipe.module';
import { AllRecipePage } from '../pages/recipe/all-recipe/all-recipe';
import { AdminModule } from './../domains/AdminManagement/admin.module';
import {PersonnalRecipePage} from '../pages/recipe/personnal-recipe/personnal-recipe';
import {FavoriteRecipePage} from '../pages/recipe/favorite-recipe/favorite-recipe';
import {CreateRecipeBasicInfoPage} from '../pages/recipe/create-recipe/pages/basic-info/basic-info';
import {ParentAuthGuardService} from '../guards/parent.auth.guard';
import {CreateRecipeIngredientsAndStepsPage} from '../pages/recipe/create-recipe/pages/ingredient-and-step/ingredient-and-step';
import {RecipeOverviewPage} from '../pages/recipe/recipe-overview/recipe-overview';


export const mainRoutes: Routes = [
    { path: '', component: AllRecipePage },
    { path: 'recipes/favorite', component: FavoriteRecipePage, canActivate: [ParentAuthGuardService]  },
    { path: 'recipes/personnal', component: PersonnalRecipePage, canActivate: [ParentAuthGuardService]  },
    { path: 'recipes/:id/overview', component: RecipeOverviewPage/*, canActivate: [ParentAuthGuardService] */},
    { path: 'recipes/create-basic', component: CreateRecipeBasicInfoPage, canActivate: [ParentAuthGuardService] },
    { path: 'recipes/create-ingredients-and-steps', component: CreateRecipeIngredientsAndStepsPage, canActivate: [ParentAuthGuardService] }
];

@NgModule({
  imports: [AdminModule, RecipeModule, RouterModule.forRoot(mainRoutes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }

export const routedComponents = [];
