import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
//import { IonicPageModule } from 'ionic-angular';

import { WebsiteModule } from '../../components/website.module';
import { AllRecipePage } from '../../pages/recipe/all-recipe/all-recipe';
import {
    CreateIngredientComponent,
} from '../../pages/recipe/create-recipe/components/create-ingredient-component/create-ingredient-component';
import {
    CreateRecipeBasicFormComponent,
} from '../../pages/recipe/create-recipe/components/create-recipe-basic-form-component/create-recipe-basic-form-component';
import {
    CreateStepComponent,
} from '../../pages/recipe/create-recipe/components/create-step-component/create-step-component';
import { StepDetailsComponent } from '../../pages/recipe/create-recipe/components/step-details/step-details';
import { StepSelectComponent } from '../../pages/recipe/create-recipe/components/step-select/step-select';
import {
    SubmitRecipeModal,
} from '../../pages/recipe/create-recipe/pages/ingredient-and-step/submit-recipe-modal/submit-recipe-modal';
import { FavoriteRecipePage } from '../../pages/recipe/favorite-recipe/favorite-recipe';
import { PersonnalRecipePage } from '../../pages/recipe/personnal-recipe/personnal-recipe';
import { RecipeOverviewPage } from '../../pages/recipe/recipe-overview/recipe-overview';
import { SharedKernelModule } from '../SharedKernel/module/shared-kernel.module';
import { recipeRoutedComponents, RecipeRoutingModule } from './recipe-routing.module';
import { CreateRecipeService } from './services/create-recipe.service';
import { RecipeService } from './services/recipe.service';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { ShareRecipeModal } from '../../pages/recipe/recipe-overview/share-recipe-modal/share-recipe-modal';
import { ContinueRecipePopover } from '../SharedKernel/components/continue-recipe-popover/continue-recipe-popover';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RecipeRoutingModule,
        // IonicPageModule.forChild(AllRecipePage),
        // IonicPageModule.forChild(FavoriteRecipePage),
        // IonicPageModule.forChild(PersonnalRecipePage),
        // IonicPageModule.forChild(RecipeOverviewPage),
        TranslateModule.forChild(),
        ReactiveFormsModule,
        SharedKernelModule,
        WebsiteModule,
        ShareButtonsModule,
        InfiniteScrollModule
    ],
    exports: [ShareButtonsModule],
    declarations: [
        recipeRoutedComponents,
        CreateRecipeBasicFormComponent,
        CreateIngredientComponent,
        CreateStepComponent,
        StepSelectComponent,
        StepDetailsComponent,
        SubmitRecipeModal,
        ShareRecipeModal,
        ContinueRecipePopover
    ],
    entryComponents: [],
    providers: [
        RecipeService,
        CreateRecipeService
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class RecipeModule { }
