import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
// import { IonicPageModule } from 'ionic-angular';

import { RecipeItemComponentWebsite } from './recipe-item-component';
import { RecipeItemComponentAdd } from './recipe-item-component-add/recipe-item-component-add';
import { SelectFormModal } from './select-form-modal/select-form-modal';

@NgModule({
    declarations: [
        RecipeItemComponentWebsite,
        RecipeItemComponentAdd,
        SelectFormModal
    ],
    imports: [
        CommonModule,
        // IonicPageModule.forChild(RecipeItemComponentWebsite),
        // IonicPageModule.forChild(RecipeItemComponentAdd),
        // IonicPageModule.forChild(SelectFormModal),
        TranslateModule.forChild(),
        FontAwesomeModule
    ],
    exports: [
        RecipeItemComponentWebsite,
        RecipeItemComponentAdd,
        SelectFormModal,
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class WebsiteModule { }