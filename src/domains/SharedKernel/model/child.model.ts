import { Allergy } from './allergy.model';
export interface Child {
    id: number,
    name: string,
    gender: string
    birthdate?: string,
    parent?: string,
    weight?: number,
    diets?: Array<any>,
    allergenics?: Array<Allergy>,
    allergies?: Array<any>
}
