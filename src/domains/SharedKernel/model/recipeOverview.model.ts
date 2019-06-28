import { DishType } from './dishType.model';
import { Ingredient } from './ingredient.model';
import { RecipeStepInDto } from './recipeStepInDto.model';
import { Season } from './season.model';
import { Step } from './step.model';

export type RecipeOverview = {
    id: number,
    name: string,
    imageUrl: string,
    imageUrlMobile: string,
    score: number,
    author: string,
    cookTip: string,
    recipeTip: string,
    ingredients: Array<Ingredient>,
    steps: Array<Step>,
    favorite: boolean,
    preparationTime: number,
    bakingTime: number,
    isSalted?: boolean,
    dishTypeId?: DishType,
    seasonsId?: Array<Season>,
    protein: number,
    lipid: number,
    carbohydrate: number,
    energy: number,
    ageRange: {
        id: number,
        max: number,
        min: number
    },
    portion: number,
    isParentReferent: boolean
}

export type RecipeOverviewVm = {
    id?: number,
    name: string,
    imageUrl: string,
    score: number,
    author: string,
    cookTip: string,
    recipeTip: string,
    ingredients: Array<Ingredient>,
    steps: Array<RecipeStepInDto>,
    favorite: boolean,
    preparationTime: number,
    bakingTime: number,
    dishTypeId?: DishType,
    seasonsId?: Array<Season>,
    isSalted: boolean,
    isParentReferent: boolean
}

export const defaultRecipeOverviewVm = {
    id: 0,
    name: '',
    imageUrl: '',
    score: 0,
    author: '',
    cookTip: '',
    recipeTip: '',
    ingredients: [],
    steps: [],
    favorite: false,
    preparationTime: 0,
    bakingTime: 0,
    isSalted: true,
    isParentReferent: false
}
