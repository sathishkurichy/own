import { List } from 'immutable';

import { Step } from '../model/step.model';

export class ListViewModel {
    label: string
    assocObject?: any
    constructor(label: string, assocObj?: any) {
        this.label = label;
        this.assocObject = assocObj;
    }
}

export function ListToListViewModel(list: List<any>): List<ListViewModel> {
    return <List<ListViewModel>>list.map(item => {
        return new ListViewModel(item.name, item);
    });
}

export function StepListToListViewModel(list: List<Step>): List<ListViewModel> {
    return list.map(step => {
        return new ListViewModel(step.freeInstruction, step);
    }).toList();
}

export function AnyToViewModel(item: any) {
    return new ListViewModel(item.name, item);
}