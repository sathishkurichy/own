import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { Store } from '@ngrx/store';
import { List } from 'immutable';
// import { IonicPage, NavController } from 'ionic-angular';
import { Validators } from '@angular/forms';
import { StepListElement, steps } from '../../../../../domains/SharedKernel/model/recipeStepInDto.model';
import { IngredientVm } from '../../../../../domains/RecipeManagement/services/create-recipe.service';

// @IonicPage()
@Component({
    selector: 'step-select',
    templateUrl: 'step-select.html',
    styleUrls: ['step-select.scss']
})
export class StepSelectComponent {
    @Input() stepForm: FormControl;
    steps: Array<StepListElement> = steps.toArray();

    constructor(){ }
}