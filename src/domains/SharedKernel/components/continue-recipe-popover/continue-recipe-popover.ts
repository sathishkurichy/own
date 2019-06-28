import { Component } from '@angular/core';
// import { ViewController } from 'ionic-angular';

@Component({
    selector: 'continue-recipe-popover',
    templateUrl: 'continue-recipe-popover.html'
})
export class ContinueRecipePopover {

    constructor() { }

    onContinueRecipe(): void {
        //this.viewCtrl.dismiss(true);
    }

    onNewRecipe(): void {
        //this.viewCtrl.dismiss(false);
    }
}