import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IngredientVm } from '../../../../../domains/RecipeManagement/services/create-recipe.service';
import { IngredientQuantityInDto } from '../../../../../domains/SharedKernel/model/ingredientQuantityInDto.model';
import {
    RecipeStepInDto,
    StepCategory,
    steps,
    StepType,
} from '../../../../../domains/SharedKernel/model/recipeStepInDto.model';
import * as _ from 'lodash';

import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'create-step-component',
    templateUrl: 'create-step-component.html',
    styleUrls: ['create-step-component.scss']
})
export class CreateStepComponent {
    stepForm: FormControl;
    stepDetailForm: FormGroup;
    //stepType: number;
    creatingStep: boolean = false;
    optionMenu: number = 0;
    stepToEditIndex: number = null;
    instruction: string;

    @Input() steps: Array<RecipeStepInDto>;
    @Input() ingredients: Array<IngredientVm>;
    @Input() disabledButton: boolean;
    @Output() stepEmitter = new EventEmitter<Array<RecipeStepInDto>>();

    faEllipsisV = faEllipsisV;
    
    constructor() { }

    ngOnInit() {
        this.initForms();
        console.log('this.steps', JSON.parse(JSON.stringify(this.steps)));
        // this.steps.sort((step1, step2) => this.sortSteps(step1, step2));
        this.sortSteps();
        console.log('this.steps', JSON.parse(JSON.stringify(this.steps)));
    }

    addStep() {
        this.creatingStep = true;
    }

    createStep() {
        if (!this.stepForm.valid || !this.stepDetailForm.valid) {
            console.error("Invalid Step Form");
        } else {
            this.formatToRecipeStepInDto()
                .then(res => {
                    if (this.stepToEditIndex) {
                        this.steps[this.stepToEditIndex - 1] = res;
                    } else {
                        this.steps.push(res);
                    }
                    this.initForms();
                    this.stepToEditIndex = null;
                    this.creatingStep = false;
                    this.optionMenu = null;
                })
                .catch(err => console.error(err));
        }
    }

    openMenu(index: number) {
        if (this.optionMenu == index) {
            this.optionMenu = 0;
        } else {
            this.optionMenu = index;
        }
        console.log('optionMenu', this.optionMenu);
    }

    optionUp(index: number) {
        console.log('index', index);
        this.steps[index - 2].stepIndex = index;
        this.steps[index - 1].stepIndex = index - 1;
        // this.steps.sort((step1, step2) => this.sortSteps(step1, step2));
        this.sortSteps();
        this.optionMenu--;
        console.log('optionMenu', this.optionMenu);
        console.log('\n');
    }

    optionDown(index: number) {
        console.log('index');
        this.steps[index - 1].stepIndex = index + 1;
        this.steps[index].stepIndex = index;
        // this.steps.sort((step1, step2) => this.sortSteps(step1, step2));
        this.sortSteps();
        this.optionMenu++;
        console.log('optionMenu', this.optionMenu);
        console.log('\n');
    }

    optionEdit(index: number) {
        this.stepToEditIndex = index;
        this.creatingStep = true;

        let step = this.steps[index - 1];

        console.log('step', step);
        this.stepForm = new FormControl({
            stepType: step.stepType,
            stepIndex: step.stepIndex,
            freeStepInstruction: step.freeStepInstruction,
            stepCategory: step.stepCategory
        }, Validators.required);
        //this.stepType = this.stepForm.value;

        setTimeout(() => {
            this.stepDetailForm.setControl('mixingTexture', new FormControl(step.mixingTexture));
            this.stepDetailForm.setControl('bakingDuration', new FormControl(step.bakingDuration));
            this.stepDetailForm.setControl('freeStepInstruction', new FormControl(step.freeStepInstruction));
            this.stepDetailForm.setControl('ingredient', new FormControl(step.ingredient? {
                ingredient: {
                    id: step.ingredient.ingredientId
                },
                quantity: step.ingredient.quantity,
                unit: {
                    id: step.ingredient.unitId
                }
            } : null));
        }, 100);
    }

    optionDelete(index: number) {
        this.steps = this.steps.filter(step => step.stepIndex != index);

        this.steps.forEach(step => {
            if (step.stepIndex > index) {
                step.stepIndex--;
            }
        });
        this.optionMenu = 0;
        this.stepEmitter.emit(this.steps);
    }

    cancelStep() {
        this.initForms();
    }

    formatToRecipeStepInDto(): Promise<RecipeStepInDto> {
        let index: number;
        if (this.stepToEditIndex) {
            index = this.stepToEditIndex;
        } else {
            index = this.steps.length + 1;
        }
        return new Promise((resolve, reject) => {
            console.log('this.stepForm.value', this.stepForm.value);
            switch (this.stepForm.value.stepType) {
                case StepType.Mix:
                    console.log('MIX', this.stepDetailForm.value);
                    resolve(<RecipeStepInDto>{
                        stepCategory: this.stepForm.value.stepCategory,
                        stepIndex: index,
                        stepType: StepType.Mix,
                        mixingTexture: parseInt(this.stepDetailForm.controls.mixingTexture.value),
                        freeStepInstruction: this.stepDetailForm.controls.freeStepInstruction.value
                    });
                    break;
                case StepType.Bake:
                    console.log('BAKE');
                    resolve(<RecipeStepInDto>{
                        stepCategory: this.stepForm.value.stepCategory,
                        stepIndex: index,
                        stepType: StepType.Bake,
                        bakingDuration: this.stepDetailForm.controls.bakingDuration.value,
                        bakingAutoMix: false,
                        freeStepInstruction: this.stepDetailForm.controls.freeStepInstruction.value
                    });
                    break;
                case StepType.Free:
                    console.log('FREE');
                    resolve(<RecipeStepInDto>{
                        stepCategory: this.stepForm.value.stepCategory,
                        stepIndex: index,
                        stepType: StepType.Free,
                        ingredient: this.stepDetailForm.controls.ingredient.value ? <IngredientQuantityInDto>{
                            ingredientId: this.stepDetailForm.controls.ingredient.value.ingredient.id,
                            quantity: this.stepDetailForm.controls.ingredient.value.quantity,
                            unitId: this.stepDetailForm.controls.ingredient.value.unit.id
                        } : null,
                        freeStepInstruction: this.stepDetailForm.controls.freeStepInstruction.value
                    });
                    break;
                case StepType.Weight:
                    console.log('WEIGHT');
                    resolve(<RecipeStepInDto>{
                        stepCategory: this.stepForm.value.stepCategory,
                        stepIndex: index,
                        stepType: StepType.Weight,
                        ingredient: this.stepDetailForm.controls.ingredient.value != 0 ? <IngredientQuantityInDto>{
                            ingredientId: this.stepDetailForm.controls.ingredient.value.ingredient.id,
                            quantity: this.stepDetailForm.controls.ingredient.value.quantity,
                            unitId: this.stepDetailForm.controls.ingredient.value.unit.id
                        } : null,
                        freeStepInstruction: this.stepDetailForm.controls.freeStepInstruction.value
                    });
                    break;
                default:
                    reject('WRONG STEP TYPE: ' + this.stepForm.value.stepType);
                    break;
            }
        })
    }

    initForms() {
        this.stepForm = new FormControl(null, Validators.required);
        this.stepForm.valueChanges.subscribe(res => {
            console.log('this.stepForm valid', this.stepForm.valid);
            console.log('this.stepForm value', this.stepForm.value);
            this.instruction = this.stepForm.value.freeStepInstruction;
            //this.stepType = this.stepForm.value;
        });

        this.stepDetailForm = new FormGroup({
            'mixingTexture': new FormControl(null),
            'bakingDuration': new FormControl(null),
            'freeStepInstruction': new FormControl(null),
            'ingredient': new FormControl(null)
        });
        this.creatingStep = false;
    }

    sortSteps() {
        console.log('steps', JSON.parse(JSON.stringify(this.steps.map(step=>step.stepIndex))));
        let newSteps = _.cloneDeep(this.steps);
        newSteps.forEach((step, index) => {
            this.steps[index] = newSteps.filter(step=>step.stepIndex == index + 1)[0];
            console.log('step ' + index, newSteps.filter(step=>step.stepIndex == index + 1)[0]);
        });
        console.log('sortedSteps', JSON.parse(JSON.stringify(this.steps.map(step=>step.stepIndex))));
    }
}