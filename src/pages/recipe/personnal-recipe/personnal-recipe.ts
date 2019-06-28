import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {
    GetRecipeCommandPayload,
    RecipeService,
    TypeOfRecipe,
} from '../../../domains/RecipeManagement/services/recipe.service';
import { RecipeTileOutDto } from '../../../domains/SharedKernel/model/recipeTileOutDto.model';
import { AuthService } from '../../../services/auth.service';
import { CreateRecipeService } from '../../../domains/RecipeManagement/services/create-recipe.service';


@Component({
    selector: 'personnal-page-recipe',
    templateUrl: 'personnal-recipe.html',
    styleUrls: ['personnal-recipe.scss']
})
export class PersonnalRecipePage {

    recipes: Array<RecipeTileOutDto> = [];
    currentPage: number = 0;

    constructor(private recipeService: RecipeService, private router: Router, private authService: AuthService, private createRecipeService: CreateRecipeService) {

    }

    ngOnInit(){
        let payload: GetRecipeCommandPayload = {
            page: this.currentPage,
            filter: TypeOfRecipe.personnal,
            orderBy: 'creationDate',
            sort: 'DESC'
        };
        this.recipeService.getRecipe(payload)
                .then(res=>{
                  res.results.forEach((item) => {
                    if (item.imageUrl == null || !item.imageUrl.startsWith('http')) {
                      item.imageUrl = "assets/img/placeholder.jpg"
                    }
                  });
                    this.recipes = res.results;
                })
                .catch(err=>{
                    console.error('getRecipe error', err);
                });
    }

    onSelectRecipePerso(recipeId: number){
        this.router.navigate(['recipes/' + recipeId + '/overview', { perso: true }]);
    }

    onCreateNewRecipe(){
        this.createRecipeService.setDefaultValue();
        this.router.navigate(['recipes/create-basic']);
    }

}
