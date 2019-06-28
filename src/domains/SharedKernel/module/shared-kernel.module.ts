import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { Camera } from '@ionic-native/camera';
// import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
// import { InAppBrowser } from '@ionic-native/in-app-browser';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//import { IonicPageModule } from 'ionic-angular';

// import { AllergyComponent } from '../components/allergy-component/allergy-component';
// import { BeabaHeaderComponent } from '../components/beaba-header-component/beaba-header-component';
// import { ChildrenAllergyComponent } from '../components/children-allergy-component/children-allergy-component';
// import { ChildrenComponent } from '../components/children-component/children-component';
// import { ChildrenDietComponent } from '../components/children-diet-component/children-diet-component';
// import { ChildrenSelectComponent } from '../components/children-select-component/children-select-component';
// import { ConfirmPopover } from '../components/confirm-popover/confirm-popover';
// import { DietComponent } from '../components/diet-component/diet-component';
// import { ErrorModalComponent } from '../components/error-modal-component/error-modal-component';
// import { IngredientmodificationModal } from '../components/ingredient-modification-modal/ingredient-modification-modal';
// import { ProofPurchasePopover } from '../components/proof-purchase-popover/proof-purchase-popover';
// import { RecipeAutoCompletionPopover } from '../components/recipe-auto-completion-popover/recipe-auto-completion-popover';
// import { RecipeSearchPopover } from '../components/recipe-search-popover/recipe-search-popover';
// import { StepComponent } from '../components/step-component/step-component';
import { CapitalizePipe } from '../pipes/capitalize.pipe';
import { FractionatePipe } from '../pipes/fractionate.pipe';
import { PasswordService } from '../services/auth/password.service';
import { DietQueryService } from '../services/queries/diet.query.service';
import { StringUtils } from '../utils/string.utils';
// import { AllergyInputModalComponent } from './../components/allergy-input-modal-component/allergy-input-modal-component';
// import { BeabaModalComponent } from './../components/beaba-modal-component/beaba-modal-component';
// import { ChildComponent } from './../components/child-component/child-component';
// import { RecipeAutoCompletionModalComponent } from './../components/recipe-auto-completion-modal-component/recipe-auto-completion-modal-component';
import { RecipeItemComponent } from './../components/recipe-item-component/recipe-item-component';
// import { TextInputModalAllergy } from '../components/children-allergy-component/text-input-modal/text-input-modal-allergy';
// import { BeabaDeviceComponent } from '../components/beaba-device-component/beaba-device-component';

@NgModule({
    declarations: [
//        BeabaHeaderComponent,
//        ChildComponent,
//        BeabaModalComponent,
//        DietComponent,
//        AllergyComponent,
//        StepComponent,
//        AllergyInputModalComponent,
        RecipeItemComponent,
        CapitalizePipe,
        FractionatePipe,
//        RecipeSearchPopover,
//        RecipeAutoCompletionModalComponent,
//        RecipeAutoCompletionPopover,
//        ErrorModalComponent,
//        ConfirmPopover,
//        ProofPurchasePopover,
//        IngredientmodificationModal,
//        ChildrenComponent,
//        ChildrenDietComponent,
//        ChildrenAllergyComponent,
//        ChildrenSelectComponent,
//        TextInputModalAllergy,
//        BeabaDeviceComponent
    ],
    imports: [
        // IonicPageModule.forChild(BeabaHeaderComponent),
        // IonicPageModule.forChild(ChildComponent),
        // IonicPageModule.forChild(BeabaModalComponent),
        // IonicPageModule.forChild(DietComponent),
        // IonicPageModule.forChild(AllergyComponent),
        // IonicPageModule.forChild(StepComponent),
        // IonicPageModule.forChild(AllergyInputModalComponent),
        // IonicPageModule.forChild(RecipeItemComponent),
        // IonicPageModule.forChild(RecipeSearchPopover),
        // IonicPageModule.forChild(ProofPurchasePopover),
        // IonicPageModule.forChild(RecipeAutoCompletionModalComponent),
        // IonicPageModule.forChild(RecipeAutoCompletionPopover),
        // IonicPageModule.forChild(IngredientmodificationModal),
        // IonicPageModule.forChild(ChildrenComponent),
        // IonicPageModule.forChild(ChildrenAllergyComponent),
        // IonicPageModule.forChild(ChildrenDietComponent),
        // IonicPageModule.forChild(ChildrenSelectComponent),
        TranslateModule.forChild(),
        CommonModule,
        FormsModule,ReactiveFormsModule
    ],
    exports: [
//        BeabaHeaderComponent,
//        ChildComponent,
//        BeabaModalComponent,
//        DietComponent,
//        AllergyComponent,
//        StepComponent,
//        AllergyInputModalComponent,
        RecipeItemComponent,
//        RecipeSearchPopover,
//        RecipeAutoCompletionPopover,
//        RecipeAutoCompletionModalComponent,
//        ProofPurchasePopover,
//        IngredientmodificationModal,
//        FractionatePipe,
//        ChildrenComponent,
//        ChildrenDietComponent,
//        ChildrenAllergyComponent,
//        ChildrenSelectComponent,
//        CapitalizePipe
    ],
    providers: [
//        Camera,
//        FileTransfer,
//        FileTransferObject,
//        InAppBrowser,
        PasswordService,
        DietQueryService,
        StringUtils
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SharedKernelModule { }
