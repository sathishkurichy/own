export type Ingredient = {
    id: number,
    name: string,
    quantity: any,
    energy?: number,
    carbohydrates?: number,
    proteins?: number,
    lipids?: number,
    nutritionalTip?: string,
    unit?: string,
    unitId?: number, 
    unitWeight?: number,
    ageMin?: number,
    ingredientId?: number,
    preparation?: string
}

export var defaultIngredient = {
    id: 0,
    name: 'String',
    quantity: 100,
}