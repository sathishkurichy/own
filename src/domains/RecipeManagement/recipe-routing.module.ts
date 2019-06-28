import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ParentAuthGuardService } from '../../guards/parent.auth.guard';
import { AllRecipePage } from '../../pages/recipe/all-recipe/all-recipe';
import { CreateRecipeBasicInfoPage } from '../../pages/recipe/create-recipe/pages/basic-info/basic-info';
import {
    CreateRecipeIngredientsAndStepsPage,
} from '../../pages/recipe/create-recipe/pages/ingredient-and-step/ingredient-and-step';
import { FavoriteRecipePage } from '../../pages/recipe/favorite-recipe/favorite-recipe';
import { PersonnalRecipePage } from '../../pages/recipe/personnal-recipe/personnal-recipe';
import { RecipeOverviewPage } from '../../pages/recipe/recipe-overview/recipe-overview';

const recipeRoutes: Routes = [
    { path: 'recipes/all', component: AllRecipePage },

];

@NgModule({
    imports: [RouterModule.forChild(recipeRoutes)],
    exports: [RouterModule]
})
export class RecipeRoutingModule { }

export const recipeRoutedComponents = [
    AllRecipePage,
    FavoriteRecipePage,
    PersonnalRecipePage,
    RecipeOverviewPage,
    CreateRecipeBasicInfoPage,
    CreateRecipeIngredientsAndStepsPage
];
