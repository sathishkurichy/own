import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
// import { IonicPageModule } from 'ionic-angular';

import { RecipeManagementPage } from './../../pages/recipe/recipe-management/recipe-management';
import { TranslatorPage } from './../../pages/translator/translator';
import { UsersPage } from './../../pages/users/users';
import { adminRoutedComponents, AdminRoutingModule } from './admin-routing.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {LocaleSelectComponent} from '../../components/locale-select-component/locale-select-component';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AdminRoutingModule,
        // IonicPageModule.forChild(UsersPage),
      //  IonicPageModule.forChild(RecipeManagementPage),
      //  IonicPageModule.forChild(TranslatorPage),
        TranslateModule.forChild(),        
        ReactiveFormsModule,
        NgxDatatableModule,
        FontAwesomeModule
    ],
    exports: [],
    declarations: [
      adminRoutedComponents,
      LocaleSelectComponent
    ],
    entryComponents: [],
    providers: [],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AdminModule { }
