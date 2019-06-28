import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Api } from '../../SharedKernel/core/api/api';
import { IngredientOutDto } from '../../SharedKernel/model/ingredientOutDto.model';
import { IngredientQuantityInDto } from '../../SharedKernel/model/ingredientQuantityInDto.model';
import { RecipeStepInDto } from '../../SharedKernel/model/recipeStepInDto.model';
import { Season } from '../../SharedKernel/model/season.model';
import { UnitOutDto } from '../../SharedKernel/model/unitOutDto.model';
import { RecipeOverviewOutDto, RecipeStepOutDto } from './recipe.service';

export type IngredientVm = {
    ingredient: IngredientOutDto,
    quantity: number,
    unit: UnitOutDto,
    preparation: string
};

@Injectable()
export class CreateRecipeService {

    basicForm: FormGroup;
    thumbnail: string;
    steps: Array<RecipeStepInDto>;
    ingredients: Array<IngredientVm>;
    edit: number;
    tmpThumbnail: File;

    constructor(api: Api) {
        this.setDefaultValue()
    }

    getBasicInfoForm(): FormGroup {
        return this.basicForm;
    }

    setBasicInfoForm(basicForm: FormGroup) {
        this.basicForm = basicForm;
    }

    setDefaultValue(recipe?: RecipeOverviewOutDto) {
        console.log('setDefaultValue', recipe);
        this.basicForm = new FormGroup({
            'name': new FormControl(recipe ? recipe.name : null, [Validators.required, Validators.minLength(1)]),
            'isSalted': new FormControl(recipe ? recipe.isSalted : null, Validators.required),
            'dishTypeId': new FormControl(recipe ? recipe.dishTypeId : null, Validators.required),
            'spring': new FormControl(recipe ? (recipe.seasonsId.filter(season => season == Season["SEASON.SPRING"]).length > 0) : null),
            'summer': new FormControl(recipe ? (recipe.seasonsId.filter(season => season == Season["SEASON.SUMMER"]).length > 0) : null),
            'fall': new FormControl(recipe ? (recipe.seasonsId.filter(season => season == Season["SEASON.FALL"]).length > 0) : null),
            'winter': new FormControl(recipe ? (recipe.seasonsId.filter(season => season == Season["SEASON.WINTER"]).length > 0) : null),
            'thumbnail': new FormControl(recipe ? recipe.imageUrl : null),
            'duration': new FormControl(recipe ? recipe.preparationTime : null, Validators.required)
        });
        console.log('recipe', recipe);
        this.thumbnail = recipe ? recipe.imageUrl : 'assets/img/placeholder.jpg';
        this.tmpThumbnail = null;
        this.steps = recipe ? this.toRecipeStepInDto(recipe.steps) : [];
        console.log('setDefaultValue steps', JSON.parse(JSON.stringify(this.steps)));
        this.ingredients = recipe ? this.toIngredientVm(recipe.ingredients) : [];
        if (recipe) {
            this.edit = recipe.id;
        } else {
            this.edit = null;
        }
    }

    getIngredients(): Array<IngredientVm> {
        return this.ingredients;
    }

    setIngredients(ingredients: Array<IngredientVm>) {
        this.ingredients = ingredients;
    }

    getSteps() {
        return this.steps;
    }

    getThumbnail() {
        return this.thumbnail;
    }

    getEdit() {
        return this.edit;
    }

    setTmpThumbnail(thumbnail: File) {
        this.tmpThumbnail = thumbnail;
    }

    getTmpThumbnail() {
        return this.tmpThumbnail;
    }

    toRecipeStepInDto(steps: Array<RecipeStepOutDto>): Array<RecipeStepInDto> {
        return steps.map(step => {
            return <RecipeStepInDto> {
                stepType: step.stepType,
                stepIndex: step.stepIndex,
                bakingAutoMix: step.bakingAutoMix,
                bakingDuration: step.bakingDuration,
                freeStepInstruction: step.freeInstruction,
                id: step.id,
                ingredient: step.ingredient ? <IngredientQuantityInDto> {
                    ingredientId: step.ingredient.id,
                    quantity: step.ingredientQuantity,
                    unitId: step.ingredientUnitId
                } : null,
                mixingTexture: step.mixingTexture,
                stepCategory: step.stepCategory
            }
        })
    }

    toIngredientVm(ingredients: Array<IngredientOutDto>): Array<IngredientVm> {
        return ingredients.map((ingredient: any) => {
            return <IngredientVm>{
                ingredient: ingredient,
                quantity: ingredient.quantity,
                unit: <UnitOutDto>{
                    id: ingredient.unitId
                },
                preparation: ingredient.preparation
            }
        })
    }
}