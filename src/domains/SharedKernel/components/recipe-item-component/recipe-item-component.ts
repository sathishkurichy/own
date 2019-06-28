import { Component, Input } from '@angular/core';

import { RecipeTileOutDto } from '../../model/recipeTileOutDto.model';

@Component({
    selector: 'recipe-item-component',
    templateUrl: 'recipe-item-component.html'
})
export class RecipeItemComponent {
    @Input() recipe?: RecipeTileOutDto = null;
}