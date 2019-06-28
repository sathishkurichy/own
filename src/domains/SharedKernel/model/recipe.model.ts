export interface Recipe {
    id: number,
    name: string,
    status: number,
    imageUrl: string,
    score: number,
    ageRangeId: number,
    ageRangeMin: number,
    ageRangeMax: number,
    preparationTime: number,
    bakingTime: number,
    isBeabaRecipe: boolean,
    isNewRecipe?: boolean,
    favorite: boolean
}

export var defaultRecipe: Recipe = {
    id: 0,
    name: "",
    status: 0,
    imageUrl: "",
    score: 0,
    ageRangeId: 0,
    ageRangeMin: 0,
    ageRangeMax: 0,
    preparationTime: 0,
    bakingTime: 0,
    isBeabaRecipe: false,
    isNewRecipe: false,
    favorite: false
}