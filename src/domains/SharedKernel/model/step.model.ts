import { Ingredient, defaultIngredient } from "./ingredient.model";
import { StepCategory } from "./recipeStepInDto.model";

export type Step = {
    id: number,
    stepIndex: number,
    imageUrl: string,
    stepType: number,
    bakingLevel: number,
    bakingDuration: number,
    bakingAutoMix: boolean,
    freeInstruction: string,
    ingredient: Ingredient,
    ingredientQuantity: string,
    ingredientUnit: string,
    stepCategory: StepCategory
}

export var defaultStep = {
    id: 0,
    stepIndex: 0,
    imageUrl: 'string',
    stepType: 0,
    bakingDuration: 0,
    bakingLevel: 0,
    bakingAutoMix: false,
    freeInstruction: 'Some instruction about some step in some recipe by some user',
    ingredient: defaultIngredient,
    ingredientQuantity: 'string',
    ingredientUnit: 'string',
    stepCategory: StepCategory.OTHER
}
