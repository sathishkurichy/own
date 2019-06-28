import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { CreateRecipeService, IngredientVm } from '../../../../../domains/RecipeManagement/services/create-recipe.service';
import { RecipeService } from '../../../../../domains/RecipeManagement/services/recipe.service';
import { IngredientOutDto } from '../../../../../domains/SharedKernel/model/ingredientOutDto.model';
import { RecipeInDto } from '../../../../../domains/SharedKernel/model/recipeInDto.model';
import { StepListElement, steps, RecipeStepInDto } from '../../../../../domains/SharedKernel/model/recipeStepInDto.model';
import { Step } from '../../../../../domains/SharedKernel/model/step.model';
import { MixingTexture } from '../../../../../domains/SharedKernel/model/texture.model';
import { IngredientQuantityInDto } from '../../../../../domains/SharedKernel/model/ingredientQuantityInDto.model';
import { UserService } from '../../../../../services/user.service';
import { Season } from '../../../../../domains/SharedKernel/model/season.model';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '../../../../../services/alert.service';

@Component({
    selector: 'ingredient-and-step-page',
    templateUrl: 'ingredient-and-step.html',
    styleUrls: ['ingredient-and-step.scss']
})
export class CreateRecipeIngredientsAndStepsPage {
    ingredients: Array<IngredientVm> = [];
    steps: Array<RecipeStepInDto> = [];
    stepTypes: Array<StepListElement> = steps.toArray();
    focus: boolean = false;
    searching: boolean = false;
    basicInfo: FormGroup;
    thumbnail: any;
    author: string;
    fileReader: FileReader = new FileReader();
    showSubmitModal: boolean = false;
    submitAnswer: Subject<boolean> = new Subject<boolean>();
    disabledButton: boolean = false;

    constructor(private createRecipeService: CreateRecipeService,
        private recipeService: RecipeService,
        private router: Router,
        private sanitizer: DomSanitizer,
        private user: UserService,
        private translate: TranslateService,
        private alert: AlertService) {

        user.getUser().then(res => {
            this.author = res.payload.username;
        });
    }

    ngOnInit() {
        this.ingredients = this.createRecipeService.getIngredients();
        // this.ingredients.forEach()
        this.steps = this.createRecipeService.getSteps();
        console.log('getSteps steps', JSON.parse(JSON.stringify(this.steps)));
        this.basicInfo = this.createRecipeService.getBasicInfoForm();
        this.thumbnail = this.createRecipeService.getTmpThumbnail() ? this.createRecipeService.getTmpThumbnail(): this.createRecipeService.getThumbnail();
        console.log('thumbnail', this.thumbnail);
    }

    ngOnDestroy() {
        this.createRecipeService.setDefaultValue()
    }

    postBeabaRecipe() {
        if (this.createRecipeService.getEdit()) {
            console.log('[RECIPE][UPDATE][SEND] :',{
              ingredients: this.mapToIngredientQuantityInDto(),
              steps: this.steps,
              name: this.basicInfo.controls.name.value,
              cookTip: '',
              dishTypeId: this.basicInfo.controls.dishTypeId.value,
              isSalted: this.basicInfo.controls.isSalted.value,
              preparationTime: this.basicInfo.controls.duration.value,
              recipeTip: '',
              seasonsId: this.getSeasons(),
              shouldKeepHot: false
            } );
            this.disabledButton = true;

            this.recipeService.updateRecipe({
                id: this.createRecipeService.getEdit(),
                recipe: <RecipeInDto>{
                    ingredients: this.mapToIngredientQuantityInDto(),
                    steps: this.steps,
                    name: this.basicInfo.controls.name.value,
                    cookTip: '',
                    dishTypeId: this.basicInfo.controls.dishTypeId.value,
                    isSalted: this.basicInfo.controls.isSalted.value,
                    preparationTime: this.basicInfo.controls.duration.value,
                    recipeTip: '',
                    seasonsId: this.getSeasons(),
                    shouldKeepHot: false
                },
                thumbnail: this.basicInfo.controls.thumbnail.value
            })
                .then(res => {
                  console.log('[RECIPE][UPDATE][SUCCESS] :', res);
                    this.disabledButton = false;
                    this.router.navigate(['recipes/personnal']);
                    this.createRecipeService.setDefaultValue();
                })
                .catch(err => {
                    if (err == 'PICTURE_ERROR') {
                        this.translate.get('ERROR.UPLOAD_RECIPE_THUMBNAIL').subscribe(res => {
                            this.disabledButton = false;
                            console.error('updateRecipe error', err);
                            alert(res);
                            this.router.navigate(['recipes/personnal']);
                        }, err => this.disabledButton = false);
                    } else {
                        this.translate.get('ERROR.UPLOAD_RECIPE').subscribe(res => {
                            this.disabledButton = false;
                            alert(res + (typeof err == 'object') ? JSON.stringify(err) : err);
                        }, err => this.disabledButton = false);
                    }
                    console.error('postNewRecipe error', err);
                });
        } else {
            console.log('createNew: file', this.basicInfo.controls.thumbnail.value);
            this.disabledButton = true;
            this.recipeService.postNewRecipe({
                recipe: <RecipeInDto>{
                    ingredients: this.mapToIngredientQuantityInDto(),
                    steps: this.steps,
                    name: this.basicInfo.controls.name.value,
                    cookTip: '',
                    dishTypeId: this.basicInfo.controls.dishTypeId.value,
                    isSalted: this.basicInfo.controls.isSalted.value,
                    preparationTime: this.basicInfo.controls.duration.value,
                    recipeTip: '',
                    seasonsId: this.getSeasons(),
                    shouldKeepHot: false
                },
                thumbnail: <File>this.basicInfo.controls.thumbnail.value
            })
                .then(res => {
                    this.disabledButton = false;
                    this.showSumbmitRecipePopover().then(submit => {
                        this.showSubmitModal = false;
                        if (submit === true) {
                            this.recipeService.submitRecipe(res.id).then(() => {
                                this.router.navigate(['recipes/personnal']);
                            }).catch(err => console.error('could not submit recipe', err))
                        } else {
                            this.router.navigate(['recipes/personnal']);
                        }

                    }).catch(err => {
                        alert('An unknown error occured');
                        console.error('PROMISE REJECTED', err);
                    });
                })
                .catch(err => {
                    if (err == 'PICTURE_ERROR') {
                        this.translate.get('ERROR.UPLOAD_RECIPE_THUMBNAIL').subscribe(res => {
                            this.disabledButton = false;
                            alert(res);
                            this.router.navigate(['recipes/personnal']);
                        }, err => this.disabledButton = false);
                    } else {
                        this.translate.get('ERROR.UPLOAD_RECIPE').subscribe(res => {
                            this.disabledButton = false;
                            alert(res + (typeof err == 'object') ? JSON.stringify(err) : err);
                        }, err => this.disabledButton = false);
                    }
                    console.error('postNewRecipe error', err);
                });
        }
    }

    mapToIngredientQuantityInDto(): Array<IngredientQuantityInDto> {
        console.log
        return this.ingredients.map(ingredient => {
            return <IngredientQuantityInDto>{
                ingredientId: ingredient.ingredient.id,
                quantity: ingredient.quantity,
                unitId: ingredient.unit.id
            }
        })
    }

    getSeasons(): Array<Season> {
        let seasons = [];
        if (this.basicInfo.controls.spring.value) {
            seasons.push(Season["SEASON.SPRING"]);
        }
        if (this.basicInfo.controls.summer.value) {
            seasons.push(Season["SEASON.SUMMER"]);
        }
        if (this.basicInfo.controls.fall.value) {
            seasons.push(Season["SEASON.FALL"]);
        }
        if (this.basicInfo.controls.winter.value) {
            seasons.push(Season["SEASON.WINTER"]);
        }
        return seasons;
    }

    changeSteps(steps: Array<RecipeStepInDto>) {
        this.steps = steps;
    }

    changeIngredients(ingredients: Array<IngredientVm>) {
        this.ingredients = ingredients;
    }

    showSumbmitRecipePopover() {
        this.showSubmitModal = true;
        return new Promise((resolve, reject) => {
            this.submitAnswer.take(1).subscribe(res => {
                resolve(res);
            }, err => {
                console.error('showSumbmitRecipePopover error', err);
                reject(err);
            });
        });
    }

    isSubmit(isSubmit: boolean) {
        this.submitAnswer.next(isSubmit);
    }

    _keyPress(event: any) {
        const pattern = /[0-9]/;
        console.log("EVENT CHAR CODE ", event.charCode);
        let inputChar = String.fromCharCode(event.charCode);
        if (event.charCode != 0) {
            if (!pattern.test(inputChar)) {
                // invalid character, prevent input
                event.preventDefault();
            }
        }
    }
};
