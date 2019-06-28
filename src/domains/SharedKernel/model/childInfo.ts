import { List, Record } from 'immutable';
import * as moment from 'moment';

import { Allergy } from '../../SharedKernel/model/allergy.model';
import { IChildBasicsInfo } from '../../SharedKernel/model/childBasicsInfo';
import { Diet } from '../../SharedKernel/model/diet.model';

export interface IChildInfo extends IChildBasicsInfo {
    id: number;
    birthdate: string;
    age: { years: number, months: number };
    gender: string;
    name: string;
    allergies?: List<Allergy>;
    diets?: List<Diet>;
    allergenics?: List<Allergy>;
}

const ChildInfoRecord = Record({
    id: null,
    name: '',
    gender: '',
    birthdate: '',
    age: null,
    allergies: List<Allergy>(),
    diets: List<Diet>(),
    allergenics: List<Allergy>()
});

export class ChildInfo extends ChildInfoRecord implements IChildInfo {

    id: number;
    name: string;
    gender: string;
    birthdate: string;
    age: { years: number, months: number };
    allergies?: List<Allergy>;
    diets?: List<Diet>;
    allergenics?: List<Allergy>;

    constructor(props: IChildInfo) {
        super(props);
    }

    static newDefaultChild(): ChildInfo {
        return new ChildInfo({
            id: null,
            name: '',
            gender: '',
            birthdate: '',
            age: null,
            allergies: List<Allergy>(),
            diets: List<Diet>(),
            allergenics: List<Allergy>()
        });
    }
}

export function getAgeFromBirthDate(birthDate: string): { years: number, months: number } {
    const now = moment();
    let birthDateMoment = moment(birthDate, "YYYY-MM-DD");
    if (birthDateMoment.isValid() == false) { // temporary fix to accept french formated dates
        return null;
    } else {
        const years = now.diff(birthDateMoment, 'year');
        birthDateMoment.add(years, 'years');

        const months = now.diff(birthDateMoment, 'months');
        birthDateMoment.add(months, 'months');

        return { years: years, months: months };
    }
}

export function getMaxAgeFromBirthDate(birthDate: string): number {
    const now = moment();
    const months = now.diff(moment(birthDate), 'months');
    let maxAge = null;
    if (months < 4) {
        maxAge = null;
    } else if (months < 7) {
        maxAge = 6;
    } else if (months < 13) {
        maxAge = 12;
    } else if (months < 25) {
        maxAge = 24;
    } else if (months < 37) {
        maxAge = 36;
    }
    return maxAge;
}

export function getAvatarFromGender(gender: string): string {
    return (gender == 'm') ? 'assets/img/childs/child_male.png' : 'assets/img/childs/child_female.png';
}