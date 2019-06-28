import { List } from 'immutable';

import { IngredientQuantityInDto } from './ingredientQuantityInDto.model';

export enum StepType {
    Mix = 1,
    Bake = 2,
    Free = 3,
    Weight = 4
}

export enum StepCategory {
    PREPARE = 0,
    PUT_IN_BASKET,
    BAKE,
    EMPTY_JUICE,
    KEEP_JUICE,
    PUT_IN_BOWL,
    ADD_JUICE,
    MIX,
    OTHER
}

export type RecipeStepInDto = {
    id?: number,
    stepIndex: number,
    stepType: StepType,
    ingredient?: IngredientQuantityInDto,
    mixingTexture?: number,
    bakingDuration?: number,
    bakingAutoMix?: boolean,
    freeStepInstruction?: string,
    icon?: string,
    stepCategory: StepCategory
}

export type StepListElement = {
    name: string,
    stepIndex: number,
    stepType: StepType,
    icon: string,
    freeStepInstruction: string,
    needIngredient: boolean,
    stepCategory: StepCategory
}

export const steps: List<StepListElement> = List<StepListElement>([
    {
        name: 'RECIPE_STEP.PREPARE',
        stepIndex: -1,
        stepType: StepType.Free,
        icon: 'cut',
        freeStepInstruction: null,
        needIngredient: true,
        stepCategory: StepCategory.PREPARE
    },
    {
        name: 'RECIPE_STEP.PUT_IN_BASKET',
        stepIndex: -1,
        stepType: StepType.Free,
        icon: 'put-in-basket',
        freeStepInstruction: 'INSTRUCTION.PUT_IN_BASKET',
        needIngredient: true,
        stepCategory: StepCategory.PUT_IN_BASKET
    },
    {
        name: 'RECIPE_STEP.BAKE',
        stepIndex: -1,
        stepType: StepType.Bake,
        icon: 'bake',
        freeStepInstruction: 'INSTRUCTION.BAKE',
        needIngredient: false,
        stepCategory: StepCategory.BAKE
    },
    {
        name: 'RECIPE_STEP.EMPTY_JUICE',
        stepIndex: -1,
        stepType: StepType.Free,
        icon: 'empty-juice',
        freeStepInstruction: 'INSTRUCTION.EMPTY_JUICE',
        needIngredient: false,
        stepCategory: StepCategory.EMPTY_JUICE
    },
    {
        name: 'RECIPE_STEP.KEEP_JUICE',
        stepIndex: -1,
        stepType: StepType.Free,
        icon: 'keep-juice',
        freeStepInstruction: 'INSTRUCTION.KEEP_JUICE',
        needIngredient: false,
        stepCategory: StepCategory.KEEP_JUICE
    },
    {
        name: 'RECIPE_STEP.PUT_IN_BOWL',
        stepIndex: -1,
        stepType: StepType.Weight,
        icon: 'put-in-bowl',
        freeStepInstruction: 'INSTRUCTION.PUT_IN_BOWL',
        needIngredient: true,
        stepCategory: StepCategory.PUT_IN_BOWL
    },
    {
        name: 'RECIPE_STEP.ADD_JUICE',
        stepIndex: -1,
        stepType: StepType.Free,
        icon: 'add-juice',
        freeStepInstruction: 'INSTRUCTION.ADD_JUICE',
        needIngredient: false,
        stepCategory: StepCategory.ADD_JUICE
    },
    {
        name: 'RECIPE_STEP.MIX',
        stepIndex: -1,
        stepType: StepType.Mix,
        icon: 'mix',
        freeStepInstruction: 'INSTRUCTION.MIX',
        needIngredient: false,
        stepCategory: StepCategory.MIX
    },
    {
        name: 'RECIPE_STEP.OTHER',
        stepIndex: -1,
        stepType: StepType.Free,
        icon: 'other',
        freeStepInstruction: 'INSTRUCTION.OTHER',
        needIngredient: false,
        stepCategory: StepCategory.OTHER
    },
])