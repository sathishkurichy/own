import { IngredientQuantityInDto } from './ingredientQuantityInDto.model';
import { RecipeStepInDto } from './recipeStepInDto.model';
import { MixingTexture } from './texture.model';

export enum AgeRangeId {
    FourToSixMonth = 1,
    SevenToEightMonth,
    NineToTwelveMonth,
    ThirteenToTwentyFourMonth,
    TwentyFourMonthOrMore,
    PregnantMother
}

export const portion: Array<{ min: number, max: number, texture: MixingTexture }> = [
    { min: 100, max: 100, texture: MixingTexture.SMOOTH },
    { min: 130, max: 150, texture: MixingTexture.SMOOTH },
    { min: 140, max: 220, texture: MixingTexture.STRANDED },
    { min: 190, max: 230, texture: MixingTexture.STRANDED },
    { min: 200, max: 300, texture: MixingTexture.CHOPPED },
    { min: 300, max: 300, texture: MixingTexture.CHOPPED }
];

export type AgeRange = {
    id: AgeRangeId,
    min: number,
    max: number
}

export const ageRanges = [
    [],
    [4, 6],
    [7, 8],
    [9, 12],
    [13, 24],
    [25, 36],
    [216, 1200]
];

export type RecipeInDto = {
    name: string;
    shouldKeepHot: boolean;
    isSalted: boolean;
    cookTip: string;
    recipeTip: string;
    preparationTime: number;
    ageRangeId?: AgeRangeId;
    dishTypeId: number;
    seasonsId: Array<number>;
    steps: Array<RecipeStepInDto>;
    ingredients: Array<IngredientQuantityInDto>;
}
