import { Component } from '@angular/core';

import { RecipeItemComponent } from '../domains/SharedKernel/components/recipe-item-component/recipe-item-component';

@Component({
    templateUrl: './recipe-item-component.html',
    selector: 'recipe-item-component-website',
    styleUrls: ['./recipe-item-component.scss']
})
export class RecipeItemComponentWebsite extends RecipeItemComponent {

    constructor() {
        super();
    }

}