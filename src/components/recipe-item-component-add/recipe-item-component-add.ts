import { Component, EventEmitter, Output } from '@angular/core';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'recipe-item-component-add',
    templateUrl: 'recipe-item-component-add.html',
    styleUrls: ['recipe-item-component-add.scss']
})
export class RecipeItemComponentAdd {
    faPlusCircle = faPlusCircle;
    @Output() onClick = new EventEmitter<void>();

    onBodyClick(): void {
        this.onClick.emit();
    }
}