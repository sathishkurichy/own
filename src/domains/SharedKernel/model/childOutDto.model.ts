import { Allergy } from './allergy.model';
import { Diet } from './diet.model';

export interface ChildOutDto {
    id: number,
    name: string,
    gender: string,
    birthdate: string,
    parent: string,
    weight?: number,
    diets?: Diet[],
    allergenics?: Allergy[],
    allergies?: Array<string>
}
