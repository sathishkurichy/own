import { Record } from 'immutable';

interface IIngredientQuantityInDtoClass {
    ingredientId: number,
    quantity: number,
    unitId: number
}

const IngredientQuantityInDtoClassRecord = Record({
    ingredientId: 0,
    quantity: 0,
    unitId: 0
});

export type IngredientQuantityInDto = {
    ingredientId: number;
    quantity: number;
    unitId: number;
}

export class IngredientQuantityInDtoClass extends IngredientQuantityInDtoClassRecord implements IIngredientQuantityInDtoClass {
    ingredientId: number;
    quantity: number;
    unitId: number;

    constructor(props: IIngredientQuantityInDtoClass) {
        super(props);
    }

    static newDefaultCreateRecipeState(): IngredientQuantityInDtoClass {
        return new IngredientQuantityInDtoClass({
            ingredientId: 0,
            quantity: 0,
            unitId: 0
        });
    }
}