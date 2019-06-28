export type IngredientOutDto = {
    id: number,
    name: string,
    energy: number,
    carbohydrates: number,
    proteins: number,
    lipids: number,
    nutritionalTip: string, //Peut etre null
    quantity: number,
    unit: string,
    unitWeight?: number,
    ageMin: number,
    unitId?: number,
    preparation?: string
}   