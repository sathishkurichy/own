import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminAuthGuardService } from '../../guards/admin.auth.guard';
import { TranslatorAuthGuardService } from '../../guards/translator.auth.guard';
import { TranslatorPage } from '../../pages/translator/translator';
import { RecipeManagementPage } from './../../pages/recipe/recipe-management/recipe-management';
import { ReviewsManagementPage } from './../../pages/reviews-management/reviews-management';
import { UsersPage } from './../../pages/users/users';
import { SavPage } from './../../pages/sav/sav';
import { SavAuthGuardService } from '../../guards/sav.auth.guard';
import { ModeratorAuthGuardService } from '../../guards/moderator.auth.guard';


const usersRoutes: Routes = [
    { path: 'users', component: UsersPage, canActivate: [AdminAuthGuardService] },
    { path: 'sav', component: SavPage, canActivate: [SavAuthGuardService] },
    { path: 'reviews-management', component: ReviewsManagementPage, canActivate: [ModeratorAuthGuardService] },
    { path: 'recipes-management', component: RecipeManagementPage, canActivateChild: [AdminAuthGuardService, TranslatorAuthGuardService] },
    { path: 'translate/:id', component: TranslatorPage, canActivate: [TranslatorAuthGuardService] }
];

@NgModule({
    imports: [RouterModule.forChild(usersRoutes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }

export const adminRoutedComponents = [UsersPage, SavPage, ReviewsManagementPage, RecipeManagementPage, TranslatorPage];
