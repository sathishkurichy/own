import { Router } from '@angular/router';
import { Component } from "@angular/core";
import { RecipeService, GetRecipeCommandPayload, TypeOfRecipe } from '../../../domains/RecipeManagement/services/recipe.service';
import { RecipeTileOutDto } from "../../../domains/SharedKernel/model/recipeTileOutDto.model";


@Component({
    selector: 'favorite-page-recipe',
    templateUrl: 'favorite-recipe.html',
    styleUrls: ['favorite-recipe.scss']
})
export class FavoriteRecipePage {

    recipes: Array<RecipeTileOutDto> = [];
    currentPage: number = 0;
    noFavorite: boolean = false;

    constructor(private recipeService: RecipeService, private router: Router) {

    }

    ngOnInit(){
        let payload: GetRecipeCommandPayload = {
            page: this.currentPage,
            filter: TypeOfRecipe.favorite
        };
        this.recipeService.getRecipe(payload)
                .then(res=>{
                    res.results.forEach((item) => {
                        if (item.imageUrl == null || !item.imageUrl.startsWith('http')) {
                            item.imageUrl = "assets/img/placeholder.jpg"
                        }
                    });
                    this.recipes = res.results;
                    if(res.count == 0){
                        this.noFavorite = true;
                    }
                })
                .catch(err=>{
                    console.error('getRecipe error', err);
                });
    }

    onSelectRecipe(recipeId: number): void {
        this.router.navigate(['recipes/' + recipeId + '/overview']);
    }

}
