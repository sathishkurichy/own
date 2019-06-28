import {Component, Output, EventEmitter, Input} from '@angular/core';
import {IngredientVm} from '../../../../domains/RecipeManagement/services/create-recipe.service';

@Component({
  selector: 'share-modal',
  templateUrl: 'share-recipe-modal.html',
  styleUrls: ['share-recipe-modal.scss']
})
export class ShareRecipeModal {

  @Input() recipeName: string;
  @Input() recipeImageUrl: string;
  @Input() currentUrl: string;

  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(){}

  close(submit: boolean){
    this.onClose.emit(submit);
  }
}
