import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../../../../domains/RecipeManagement/services/recipe.service';
import { DishType } from '../../../../../domains/SharedKernel/model/dishType.model';
import { RecipeInDto } from '../../../../../domains/SharedKernel/model/recipeInDto.model';
import { StepListElement, steps } from '../../../../../domains/SharedKernel/model/recipeStepInDto.model';
import { Season } from '../../../../../domains/SharedKernel/model/season.model';
import { CreateRecipeService } from '../../../../../domains/RecipeManagement/services/create-recipe.service';

@Component({
    selector: 'basic-info-page',
    templateUrl: 'basic-info.html',
    styleUrls: ['basic-info.scss']
})
export class CreateRecipeBasicInfoPage {

    steps: Array<any> = [];
    recipe: RecipeInDto;
    DishType: any = DishType;
    dishTypes: Array<DishType>;
    stepTypes: Array<StepListElement> = steps.toArray();
    Season: any = Season;
    seasons: Array<Season>;
    basicInfo: FormGroup;
    basicInfoValid: boolean = false;

    constructor(private createRecipeService: CreateRecipeService, 
                private recipeService: RecipeService, 
                private router: Router,
                private route: ActivatedRoute) {
                    
        this.dishTypes = [
            DishType["DISH_TYPE.DESERT"],
            DishType["DISH_TYPE.DRINK"],
            DishType["DISH_TYPE.MAIN_DISH"],
            DishType["DISH_TYPE.OTHER"],
            DishType["DISH_TYPE.SOUP"]
        ];
        this.seasons = [
            Season["SEASON.FALL"],
            Season["SEASON.SPRING"],
            Season["SEASON.SUMMER"],
            Season["SEASON.WINTER"]
        ];

    }

    ngOnInit(){
        this.route.params.subscribe(params=>{
            this.basicInfo = this.createRecipeService.getBasicInfoForm();
        });
    }

    nextPage(){
        this.createRecipeService.setBasicInfoForm(this.basicInfo);
        this.router.navigate(['recipes/create-ingredients-and-steps']);
    }
}