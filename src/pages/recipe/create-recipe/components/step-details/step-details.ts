import { Component, Input } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
// import { IonicPage } from 'ionic-angular';

import { textures } from '../../../../../domains/SharedKernel/model/texture.model';
import { StepType, StepCategory } from '../../../../../domains/SharedKernel/model/recipeStepInDto.model';
import { IngredientVm } from '../../../../../domains/RecipeManagement/services/create-recipe.service';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';

// @IonicPage()
@Component({
    selector: 'step-details',
    templateUrl: 'step-details.html',
    styleUrls: ['step-details.scss']
})
export class StepDetailsComponent {

    _stepType: StepType = null;
    textures = textures;
    ingredientQuantity: FormControl;
    freeInstruction: string;
    needIngredient: boolean = false;
    stepCategory: StepCategory;

    @Input() stepForm: FormGroup;
    @Input() ingredients: Array<IngredientVm>;
    @Input() set step(step: any) {
        console.log('step', step);
        this.needIngredient = step.needIngredient;
        this.stepForm.setControl('mixingTexture', new FormControl(null));
        this.stepForm.setControl('bakingDuration', new FormControl(null));
        this.stepForm.setControl('freeStepInstruction', new FormControl(null));
        this.stepForm.setControl('ingredient', new FormControl(null));

        this._stepType = step.stepType;
        this.stepCategory = step.stepCategory;
        if(this.stepCategory == StepCategory.PREPARE) {
            console.log('this.stepCategory == StepCategory.PREPARE', step);
            this.freeInstruction = step.preparation;
        } else {
            this.freeInstruction = step.freeStepInstruction;
        }
        this.formSubscribe();
    }

    constructor(private translate: TranslateService) {
        this.ingredientQuantity = new FormControl(null)
        this.ingredientQuantity.valueChanges.subscribe(quantity => {
            let x = _.cloneDeep(this.stepForm.controls.ingredient.value);
            x.quantity = quantity;
            this.stepForm.controls.ingredient.setValue(x)
        });
    }

    formSubscribe() {
        console.log('formSubscribe');
        this.stepForm.setControl('freeStepInstruction', new FormControl(null, Validators.required));
        if (this.needIngredient) {
            this.stepForm.setControl('ingredient', new FormControl(null, Validators.required));
        }

        switch (this._stepType) {
            case StepType.Mix:
                this.stepForm.setControl('mixingTexture', new FormControl(null, Validators.required));
                break;
            case StepType.Bake:
                this.stepForm.setControl('bakingDuration', new FormControl(null, Validators.required));
                break;
            default:
                console.error('error step type not found');
                break;
        }
        if (this.freeInstruction) {
            this.translate.get(this.freeInstruction, this.stepForm.controls.ingredient.value ? { ingredient: this.stepForm.controls.ingredient.value } : null).subscribe(instruction => {
                this.stepForm.controls.freeStepInstruction.setValue(instruction);
                this.stepForm.updateValueAndValidity();
                console.log('after translation this.stepForm', this.stepForm);
                console.log('after translation this.stepForm', this.stepForm.value.mixingTexture);
            });
        } else {
            this.stepForm.updateValueAndValidity();
            console.log('this.stepForm.valid', this.stepForm.valid);
        }

        this.stepForm.controls.ingredient.valueChanges.subscribe(res => {
            console.log('this.stepCategory', res);
            if (this.stepCategory == StepCategory.PREPARE) {
                console.log('ingredient change prepare', res);
                this.stepForm.controls.freeStepInstruction.setValue(res.preparation);
            } else {
                if(this._stepType == StepType.Weight && !res){
                    this.translate.get('RECIPE_MANAGEMENT.CREATE_RECIPE.BASKET_CONTENT').subscribe(content => {
                        this.translate.get(this.freeInstruction, { ingredient: content }).subscribe(instruction => {
                            this.stepForm.controls.freeStepInstruction.setValue(instruction);
                        });
                    });
                } else{
                    this.translate.get(this.freeInstruction, { ingredient: res.ingredient.name }).subscribe(instruction => {
                        this.stepForm.controls.freeStepInstruction.setValue(instruction);
                    });
                }
            }
        });

        this.stepForm.valueChanges.subscribe(res => {
            if (res.ingredient && res.ingredient.quantity != this.ingredientQuantity.value) {
                this.ingredientQuantity.setValue(res.ingredient.quantity);
                this.ingredientQuantity.setValidators([Validators.required, Validators.max(res.ingredient.quantity)]);
            }
        });
    }

    _keyPress(event: any) {
        const pattern = /[0-9]/;
        console.log("EVENT CHAR CODE ", event.charCode);
        let inputChar = String.fromCharCode(event.charCode);
        if (event.charCode != 0) {
            if (!pattern.test(inputChar)) {
                // invalid character, prevent input
                event.preventDefault();
            }
        }
    }
}
