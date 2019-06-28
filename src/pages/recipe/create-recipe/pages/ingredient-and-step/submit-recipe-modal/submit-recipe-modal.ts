import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'submit-modal',
    templateUrl: 'submit-recipe-modal.html',
    styleUrls: ['submit-recipe-modal.scss']
})
export class SubmitRecipeModal {

    @Output() isSubmit: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(){}

    submit(submit: boolean){
        this.isSubmit.emit(submit);
    }
}