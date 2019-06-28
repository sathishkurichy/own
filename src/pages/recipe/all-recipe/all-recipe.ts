import { Component, ViewChild, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

import {
    GetRecipeCommandPayload,
    RecipeService,
    TypeOfRecipe,
} from '../../../domains/RecipeManagement/services/recipe.service';
import { DishType } from '../../../domains/SharedKernel/model/dishType.model';
import { Ingredient } from '../../../domains/SharedKernel/model/ingredient.model';
import { IngredientOutDto } from '../../../domains/SharedKernel/model/ingredientOutDto.model';
import { AgeRangeId, ageRanges } from '../../../domains/SharedKernel/model/recipeInDto.model';
import { RecipeTileOutDto } from '../../../domains/SharedKernel/model/recipeTileOutDto.model';
import { Season } from '../../../domains/SharedKernel/model/season.model';
import { faTimesCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { PlatformLocation } from '@angular/common'
import { AuthService } from '../../../services/auth.service'
import { LocaleInDto } from '../../../domains/SharedKernel/model/localeInDto.model';
import { UserService } from '../../../services/user.service';


const STORAGE_KEY = 'local_search_key';
const INGREDIENTS_KEY = 'ingredients_search_key';

@Component({
    selector: 'all-page-recipe',
    templateUrl: 'all-recipe.html',
    styleUrls: ['all-recipe.scss']
})
export class AllRecipePage {

    searchForm: FormGroup;
    recipes: Array<RecipeTileOutDto> = [];
    myRecipes: Array<RecipeTileOutDto> = [];
    favoritesRecipes: Array<RecipeTileOutDto> = [];
    dishTypes: Array<DishType>;
    seasons: Array<Season>;
    ageRangeIds: Array<AgeRangeId>;
    sortOptions: Array<{ value: string, name: string }>;
    DishType: any = DishType;
    Season: any = Season;
    AgeRangeId: any = AgeRangeId;
    payload: GetRecipeCommandPayload;
    ingredientCompletion: Array<IngredientOutDto> = [];
    searching: boolean = false;
    searchingRecipes: boolean = false;
    focus: boolean = false;
    listIngredientSelected: Array<Ingredient> = [];
    ingredientsSearch: Array<Ingredient> = [];
    ageRanges = ageRanges;
    showSearchOptions: boolean = false;
    waiting: boolean = false;
    recipePage: number = 1;
    savedSearch: GetRecipeCommandPayload;
    isResetCanBeEnabled: boolean = false;
    locales: Array<LocaleInDto> = [];
    translateFormGroup: FormGroup;
    translateLocale: string;
    isLastRecipePage = false;
    totalCountRecipes = 0;


    faTimesCircle = faTimesCircle;
    faSpinner = faSpinner;

    @ViewChild('ageSelect') ageSelect;

    runInBrowser: boolean = false;

    constructor(private recipeService: RecipeService, private router: Router, private translate: TranslateService,
                @Inject(SESSION_STORAGE) private storage: StorageService, public zone: NgZone, public location: PlatformLocation,
                @Inject(PLATFORM_ID) private platformId: Object, public authService: AuthService, public userService: UserService) {

        this.dishTypes = [
            DishType["DISH_TYPE.SOUP"],
            DishType["DISH_TYPE.MAIN_DISH"],
            DishType["DISH_TYPE.DESERT"],
            DishType["DISH_TYPE.DRINK"],
            DishType["DISH_TYPE.OTHER"]
        ];

        this.seasons = [
            Season["SEASON.SPRING"],
            Season["SEASON.SUMMER"],
            Season["SEASON.FALL"],
            Season["SEASON.WINTER"]
        ];
        this.ageRangeIds = [
            AgeRangeId.FourToSixMonth,
            AgeRangeId.SevenToEightMonth,
            AgeRangeId.NineToTwelveMonth,
            AgeRangeId.ThirteenToTwentyFourMonth,
            AgeRangeId.TwentyFourMonthOrMore,
            AgeRangeId.PregnantMother
        ];
        this.sortOptions = [
            { value: 'name', name: 'SORT_OPTION.NAME' },
            { value: 'creationDate', name: 'SORT_OPTION.CREATION_DATE' },
            { value: 'inFavorites', name: 'SORT_OPTION.IN_FAVORITE' },
            { value: 'pertinence', name: 'SORT_OPTION.PERTINENCE' }
        ];
        console.log("AGE",this.ageRangeIds);
        this.runInBrowser = isPlatformBrowser(this.platformId);
        this.translateLocale = null;
    }

    ngOnInit() {
        this.translateFormGroup = new FormGroup({'recipeLocaleFormControl': new FormControl(null)});

        this.searchForm = new FormGroup({
            'ingredient': new FormControl(''),
            'salted': new FormControl(null),
            'typeOfDish': new FormControl(null),
            'season': new FormControl(null),
            'sortOrder': new FormControl(null),
            'ageRangeId': new FormControl(null)
        });

        this.savedSearch = this.runInBrowser && this.storage.get(STORAGE_KEY) || null;
        this.ingredientsSearch = this.runInBrowser && this.storage.get(INGREDIENTS_KEY) || null;

        if (this.savedSearch != null) {
            this.storage.remove(STORAGE_KEY);
            if (this.savedSearch.ageRangeId) {
                this.searchForm.controls.ageRangeId.setValue(this.ageRangeIds[this.savedSearch.ageRangeId - 1]);
            }
            if (this.savedSearch.dishTypeId) {
                this.searchForm.controls.typeOfDish.setValue(this.dishTypes[this.savedSearch.dishTypeId - 1]);
            }
            if (this.savedSearch.seasons) {
                this.searchForm.controls.season.setValue(this.seasons[this.savedSearch.seasons - 1]);
            }
            if (this.savedSearch.sort) {
                this.searchForm.controls.sortOrder.setValue(this.savedSearch.sort);
            }
            if (this.savedSearch.salted === true) {
                this.searchForm.controls.salted.setValue(true);
            } else if (this.savedSearch.salted === false) {
                this.searchForm.controls.salted.setValue(false);
            }

            if (this.ingredientsSearch != null) {
                this.listIngredientSelected = this.ingredientsSearch;
            }

            if (this.savedSearch.page != null) {
                // console.log('this.savedSearch.page',this.savedSearch.page);
                this.savedSearch.page = 1;
                this.recipePage = this.savedSearch.page;

            }
            if (this.savedSearch.locale != null) {
                console.log('this.savedSearch.locale',this.savedSearch.locale);
                this.translateLocale = this.savedSearch.locale;
            }

            if (this.runInBrowser) {
                this.searchRecipe(false).then(recipes => {
                    this.updateRecipes(recipes);
                }).catch(err => {
                    console.error('GET_RECIPE ERROR ', err);
                });
            }
        } else {
            if (this.runInBrowser) {
                this.searchRecipe().then(recipes => {
                    this.updateRecipes(recipes);
                }).catch(err => {
                    console.error('GET_RECIPE ERROR ', err);
                });
            }
        }

        this.searchForm.controls['salted'].valueChanges
            .distinctUntilChanged()
            .subscribe(res => {
                if(!this.waiting) {
                    this.waiting = true;
                    this.searchForm.disable({
                        onlySelf: true,
                        emitEvent: false
                    });
                    this.searchRecipe().then(recipes => this.updateRecipes(recipes));
                }
            });

        this.searchForm.controls['typeOfDish'].valueChanges
            .distinctUntilChanged()
            .subscribe(res => {
                if(!this.waiting) {
                    this.waiting = true;
                    this.searchForm.disable({
                        onlySelf: true,
                        emitEvent: false
                    });
                    this.searchRecipe().then(recipes => this.updateRecipes(recipes));
                }
            });

        this.searchForm.controls['season'].valueChanges
            .distinctUntilChanged()
            .subscribe(res => {
                if(!this.waiting) {
                    this.waiting = true;
                    this.searchForm.disable({
                        onlySelf: true,
                        emitEvent: false
                    });
                    this.searchRecipe().then(recipes => this.updateRecipes(recipes));
                }
            });

        this.searchForm.controls['sortOrder'].valueChanges
            .distinctUntilChanged()
            .subscribe(res => {
                if(!this.waiting) {
                    this.waiting = true;
                    this.searchForm.disable({
                        onlySelf: true,
                        emitEvent: false
                    });
                    this.searchRecipe().then(recipes => this.updateRecipes(recipes));

                }
            });

        this.searchForm.controls['ageRangeId'].valueChanges
            .distinctUntilChanged()
            .subscribe(res => {
                if(!this.waiting) {
                    this.waiting = true;
                    this.searchForm.disable({
                        onlySelf: true,
                        emitEvent: false
                    });
                    this.searchRecipe().then(recipes => this.updateRecipes(recipes));
                }
            });

        this.searchForm.controls.ingredient.valueChanges
            .do(res => this.searching = true)
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe(res => {
                if (res == "") {
                    this.ingredientCompletion = [];
                    this.searching = false;
                }
                else {
                    this.recipeService.getIngredients({
                        autocomplete: res
                    }).then(list => {
                        this.ingredientCompletion = list;
                        this.searching = false;
                    }).catch(err => {
                        console.error('Err looking for ingredients', err);
                        this.searching = false;
                    });
                }
            }, err => console.error('Err looking for ingredients', err));

        this.searchForm.valueChanges.subscribe(() => {
            this.isResetCanBeEnabled = true;
            console.log("isResetCanBeEnabled", this.isResetCanBeEnabled);

        });

        this.userService.getAvailableLanguages()
            .then((res) => {
                this.locales = res;
            });
    }

    onScroll() {
        console.log('ONSCROLL');
        if(this.recipes != null && this.recipes.length >= 30 && this.recipePage > 1 && !this.searchingRecipes && !this.isLastRecipePage) {
            console.log("Search");
            this.searchRecipe(false, this.recipePage).then(recipes => this.updateRecipes(recipes));
        }
    }

    selectIngredient(ingredient: Ingredient) {
        if(!this.waiting) {
            this.waiting = true;
            this.searchForm.disable({
                onlySelf: true,
                emitEvent: false
            });
            this.listIngredientSelected.push(ingredient);
            this.searchForm.controls.ingredient.setValue('');
            this.searchRecipe().then(recipes => this.updateRecipes(recipes));
        }else{
            // TODO reset value of the input
            this.searchForm.controls.ingredient.setValue('');
        }
    }

    removeIngredient(ingredient: Ingredient) {
        this.listIngredientSelected = this.listIngredientSelected.filter(res => res.id != ingredient.id);
        this.searchRecipe().then(recipes=>this.updateRecipes(recipes));
    }

    ingredientInputBlur() {
        setTimeout(() => {
            this.focus = false;
        }, 200);
    }

    searchRecipe(refreshSearch: boolean = true, page: number = 1): Promise<Array<RecipeTileOutDto>> {
        this.searchingRecipes = true;
        console.log('refreshSearch',refreshSearch);
        console.log('this.recipePage',this.recipePage);
        console.log('this.recipes.length',this.recipes.length);


        if(this.translateLocale == null && this.authService.isLogged()) {
            this.translateLocale = null;
        } else if(!this.authService.isLogged()){
            this.translateLocale = this.translate.currentLang;
        }
        console.log('recipeSearch locale',this.translateLocale);

        if(refreshSearch){
            this.recipes = null;
            this.recipePage = 1;
        }

        if (refreshSearch == false && this.savedSearch != null) {
            this.savedSearch.page = this.recipePage;
            this.payload = this.savedSearch;
            console.log('savedSearch locale',this.savedSearch.locale);

            //this.payload.locale = this.translateLocale;
        } else {
            this.recipePage = page;

            this.payload = {
                page: this.recipePage,
                salted: this.searchForm.controls.salted.value,
                dishTypeId: this.searchForm.controls.typeOfDish.value,
                seasons: this.searchForm.controls.season.value,
                sort: this.searchForm.controls.sortOrder.value,
                ageRangeId: this.searchForm.controls.ageRangeId.value,
                filter: TypeOfRecipe.public,
                locale: this.translateLocale,
                ingredients: this.listIngredientSelected.length > 0 ? this.listIngredientSelected.map(res => res.id) : null
            };
        }
        return new Promise<Array<RecipeTileOutDto>>((resolve, reject) => {
            this.recipeService.searchRecipe(this.payload)
                .then((res) => {
                    resolve(res.results);
                    this.totalCountRecipes = res.totalCount;
                    this.searchingRecipes = false;
                })
                .catch(err => {
                    console.error('GET_RECIPE ERROR ', err);
                    this.searchingRecipes = false;
                    reject();
                });
        })

    }

    onSelectRecipe(id: number) {
        if (this.searchForm.controls.salted.value === "true") {
            this.payload.salted = true;
        } else if (this.searchForm.controls.salted.value === false) {
            this.payload.salted = false;
        }
        this.storage.set(STORAGE_KEY, this.payload);
        if (this.listIngredientSelected != []) {
            this.storage.set(INGREDIENTS_KEY, this.listIngredientSelected);
        }

        if(this.translateLocale) {
            this.router.navigate(["recipes/" + id + "/overview", {
                locale_translate: this.translateLocale
            }]);
        }else{
            this.router.navigate(["recipes/" + id + "/overview"]);
        }
    }

    updateRecipes(newRecipes: any) {
        this.recipePage == 1 ? this.recipes = newRecipes : newRecipes
            .forEach(recipe => {
                if (recipe.imageUrl == null || !recipe.imageUrl.startsWith('http')) recipe.imageUrl = "assets/img/placeholder.jpg";
                this.recipes.push(recipe);
            });

        if(this.recipes.length >= 30 && this.recipes.length < this.totalCountRecipes){
            this.recipePage++;
            this.isLastRecipePage = false;
        }else if(this.recipes.length == this.recipes.length){
            this.isLastRecipePage = true;
        }
        this.searchForm.enable({
            onlySelf: true,
            emitEvent: false
        });
        this.waiting = false;
    }

    resetSearch() {
        this.listIngredientSelected = [];

        this.searchForm.controls.ageRangeId.setValue(null);
        this.searchForm.controls.typeOfDish.setValue(null);
        this.searchForm.controls.season.setValue(null);
        this.searchForm.controls.sortOrder.setValue(null);
        this.searchForm.controls.salted.setValue(null);
        this.savedSearch = null;
        this.ingredientsSearch = null;

        this.storage.remove(STORAGE_KEY);

        this.searchRecipe(false).then(recipes => {
            this.updateRecipes(recipes);
        }).catch(err => {
            console.error('GET_RECIPE ERROR ', err);
        });
        this.isResetCanBeEnabled = false;

    }

    onLocaleChange(event: any): void {
        this.translateLocale = event.target.value;
        if(this.savedSearch != null) {
            this.savedSearch.locale = this.translateLocale;
        }
        console.log('onLocaleChange', this.translateLocale);
        this.searchRecipe(true, 1 ).then((recipes) => {
            this.updateRecipes(recipes);
        }).catch(err => {
            console.error('GET_RECIPE ERROR ', err);
        });
    }
}
