import { Location, isPlatformBrowser } from '@angular/common';
import { Component, ViewChild, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
// import { Content } from 'ionic-angular/components/content/content';
// import { Loading } from 'ionic-angular/components/loading/loading';
import * as moment from 'moment';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import { CreateRecipeService } from '../../../domains/RecipeManagement/services/create-recipe.service';
import {
    defaultRecipeOverviewOutDto,
    RecipeOverviewOutDto,
    RecipeService,
} from '../../../domains/RecipeManagement/services/recipe.service';
import { ChildInfo } from '../../../domains/SharedKernel/model/childInfo';
import { AgeRangeId } from '../../../domains/SharedKernel/model/recipeInDto.model';
import { RecipeReviewOutDto } from '../../../domains/SharedKernel/model/review.model';
import { Texture, textures } from '../../../domains/SharedKernel/model/texture.model';
import { AlertService } from '../../../services/alert.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from './../../../services/auth.service';
import { Meta } from '@angular/platform-browser';
import {Constantes} from '../../../environments/environment';

type Nutrition = {
    proteins: number,
    carbohydrates: number,
    lipids: number,
    energy: number
}

@Component({
    selector: 'page-recipe-overview',
    templateUrl: 'recipe-overview.html',
    styleUrls: ['recipe-overview.scss']
})
export class RecipeOverviewPage {

    recipeId: number;
    ingredientOffset: number;
    tipOffset: number;
    commentOffset: number;
    recipeTotalquantity: number;
    unit: string;
    recipe: RecipeOverviewOutDto = defaultRecipeOverviewOutDto;
    nutritionalTip: string = "";
    activeTab: number = 0;
    scroll: number = 0;
    reviews: Array<RecipeReviewOutDto> = Array<RecipeReviewOutDto>();
    review: FormControl = new FormControl('', Validators.required);
    child: ChildInfo = ChildInfo.newDefaultChild();
    portion: number = 0;
    perso: boolean = false;
    isConnected: boolean = false;
    ageRange: AgeRangeId;
    texture: Texture = {
        dishTypeId: 1,
        name: "TEXTURE.SMOOTH"
    };
    textureList: Array<string> = textures.map(texture => texture.name).toArray();
    nbPortion: number = 1;
    Math = Math;
    nbPortionList: Array<number> = [];
    portionList: Array<number> = [];
    portionControl: FormControl = new FormControl(100);
    nbPortionControl: FormControl = new FormControl(1);
    //loadingSpinner: Loading;
    reviewPage: number = 1;
    line = 1;
    textureModal: boolean = false;
    portionModal: boolean = false;
    nbPortionModal: boolean = false;
    disabledButton: boolean = true;

    currentURL: string = '';

    showShareModal: boolean = false;

    thumbnail: any;
    locale_translate: string = null;
    user_locale: string = null;

    @ViewChild("slideBar") slideBar: { nativeElement: HTMLDivElement };
   // @ViewChild(Content) content: Content;

    runInBrowser: boolean = false;

    constructor(private translate: TranslateService,
        private recipeService: RecipeService,
        private route: ActivatedRoute,
        public authService: AuthService,
        private router: Router,
        private location: Location,
        private userService: UserService,
        private createRecipeService: CreateRecipeService,
        private alertService: AlertService,
        private meta: Meta,
        @Inject(PLATFORM_ID) private platformId: Object, 
        @Inject(APP_ID) private appId: string
    ) {

        this.currentURL = Constantes.SERVER_URL + "/#" + this.router.url; //window.location.href;

        for (let x = 1; x <= 12; x++) {
            this.nbPortionList.push(x);
        }
        this.runInBrowser = isPlatformBrowser(platformId);
    }

    ngAfterViewInit() {

        let ctrlDown = false,
            ctrlKey = 17,
            enterKey = 13,
            deleteKey = 46,
            backspaceKey = 8,
            cmdKey = 91,
            vKey = 86,
            line = 0;

        if (!this.perso) {
            if (this.runInBrowser) {
                document.getElementById("text-area").addEventListener("keyup", (event: any) => {
                    if (event.keyCode == ctrlKey || event.keyCode == cmdKey) {
                        ctrlDown = false;
                    }
                });
                document.getElementById("text-area").addEventListener("keydown", (event: any) => {
                    if (event.keyCode == ctrlKey || event.keyCode == cmdKey) {
                        ctrlDown = true;
                        return;
                    }

                    line = (event.path[0].value.match(/\r?\n/g) || []).length + 1;
                    if (event.keyCode != backspaceKey && event.keyCode != deleteKey) {
                        if (this.review.value.length >= 500 || (ctrlDown && event.keyCode == vKey) || (event.keyCode == enterKey && line >= 5)) {
                            event.preventDefault();
                        }
                    }
                });
            }
        }
    }

    ngOnInit() {

        // GET ID FROM ROUTER
        this.route.params.subscribe(params => {
            const id = +params['id'];
            this.recipeId = id;
            if (params['perso']) {
                this.perso = true;
            }
            if(params['locale_translate']){
                this.locale_translate = params['locale_translate'];
                this.translate.use(this.locale_translate);
            }

            // REQUEST RECIPE FROM ID
            this.userService.getUser().then(user => {
                if(user.payload.errorCode != 3008){
                    this.isConnected = true;
                    this.user_locale = user.payload.locale;
                }

                if (user.payload.locale == "en_US" || this.translate.currentLang == "en_US" && !this.isConnected) {
                    this.portionControl = new FormControl(10);
                    for (let x = 1; x <= 100; x++) {
                        this.portionList.push(Math.round(x * 2) / 10);
                    }
                } else {
                    this.portionControl = new FormControl(100);
                    for (let x = 1; x <= 100; x++) {
                        this.portionList.push(x * 5);
                    }
                }
                if (this.locale_translate) {
                    if (this.locale_translate == "en_US") {
                        this.portionControl = new FormControl(10);
                        for (let x = 1; x <= 100; x++) {
                            this.portionList.push(Math.round(x * 2) / 10);
                        }
                    } else {
                        this.portionControl = new FormControl(100);
                        for (let x = 1; x <= 100; x++) {
                            this.portionList.push(x * 5);
                        }
                    }
                }

                this.portion = this.portionControl.value;

                this.recipeService
                    .getRecipeOverview({
                        id: this.recipeId,
                        quantity: this.perso ? null : this.portionControl.value,
                        locale: (!this.isConnected) ? this.translate.currentLang : null,
                        locale_translate: (this.locale_translate) ? this.locale_translate : null
                    })
                    .then(res => {

                        this.disabledButton = false;
                        this.recipe = res;
                        if (res.imageUrl == null || !res.imageUrl.startsWith('http')) {
                            this.thumbnail = "assets/img/placeholder.jpg"
                        }
                        else {
                            this.thumbnail = res.imageUrl;
                        }
                        this.nutritionalTip = this.recipe.ingredients[Math.ceil(Math.random() * this.recipe.ingredients.length - 1)].nutritionalTip;

                        //  Add meta tag to DOM for social sharing
                        this.meta.addTag({ name: 'og:title', content: this.recipe.name });
                        this.meta.addTag({ name: 'og:description', content: this.recipe.name });
                        this.meta.addTag({ name: 'og:image', content: this.recipe.imageUrl });
                        this.meta.addTag({ name: 'og:url', content: this.currentURL /*window.location.href*/ });
                    })
                    .catch(err => {
                        console.error('ERROR: get recipe overview ', err);
                        this.disabledButton = false;
                    });
                //REQUEST REVIEWS OF RECIPE FROM ID
                if (!this.perso) {
                    this.getReview();
                }
            });


        });
    }

    getAgeRangeFromBirthDate(birthDate: string): AgeRangeId {

        const now = moment();
        const months = now.diff(moment(birthDate), 'months');

        let ageRange = null;
        if (months < 7) {
            ageRange = AgeRangeId.FourToSixMonth;
        } else if (months < 9) {
            ageRange = AgeRangeId.SevenToEightMonth;
        } else if (months < 13) {
            ageRange = AgeRangeId.NineToTwelveMonth;
        } else if (months < 25) {
            ageRange = AgeRangeId.ThirteenToTwentyFourMonth;
        } else if (months < 216) {
            ageRange = AgeRangeId.TwentyFourMonthOrMore;
        } else {
            ageRange = AgeRangeId.PregnantMother;
        }

        return ageRange;
    }

    getReview() {
        this.disabledButton = true;
        this.recipeService
            .getRecipeReview(this.recipeId, this.reviewPage)
            .then((res: Array<RecipeReviewOutDto>) => {
                this.disabledButton = false;
                this.reviews = res;
            })
            .catch(err => {
                console.error(err);
                this.disabledButton = false;
            });
    }

    addReview() {
        this.recipeService.postRecipeReview(this.recipe.id, this.review.value)
            .then(res => {
                this.getReview();
                this.review.reset('');
            })
            .catch(err => console.error('post review error', err));
    }

    showMoreMenu(ev: UIEvent) {
        console.warn('TODO: Create option menu');
    }

    isSuperiorThanParent(): boolean {
        return this.authService.isTranslator() || this.authService.isAdmin() || this.authService.isModerator();
    }

    translateRecipe(): void {
        this.router.navigate(['translate/' + this.recipeId, 
            {
                locale_translate: (this.locale_translate) ? this.locale_translate : this.translate.currentLang
            }
        ]);
    }

    selectTexture(newTexture: string) {
        this.texture = textures.filter(texture => texture.name == newTexture).first();
    }

    selectPortion(quantity: number) {
        this.portion = quantity;
        this.recipeService
            .getRecipeOverview({
                id: this.recipeId,
                quantity: this.portion,
                numberPortion: this.nbPortion,
                locale: this.translate.currentLang
            })
            .then(res => {
                this.disabledButton = false;
                this.recipe = res;
                if (res.imageUrl == null || !res.imageUrl.startsWith('http')) {
                    this.thumbnail = "assets/img/placeholder.jpg"
                }
                else {
                    this.thumbnail = res.imageUrl;
                }
            })
            .catch(err => {
                console.error('ERROR: get recipe overview ', err);
                this.disabledButton = false;
            });
    }

    selectNbPortion(nbPortion) {
        this.nbPortion = nbPortion;
        this.recipeService
            .getRecipeOverview({
                id: this.recipeId,
                quantity: this.portion,
                numberPortion: this.nbPortion,
                locale: this.translate.currentLang
            })
            .then(res => {
                this.disabledButton = false;
                this.recipe = res;
                if (res.imageUrl == null || !res.imageUrl.startsWith('http')) {
                    this.thumbnail = "assets/img/placeholder.jpg"
                }
                else {
                    this.thumbnail = res.imageUrl;
                }
            })
            .catch(err => {
                console.error('ERROR: get recipe overview ', err);
                this.disabledButton = false;
            });
    }

    removeRecipe() {
        this.disabledButton = true;
        this.recipeService.deleteRecipe(this.recipe.id)
            .then(res => this.location.back())
            .catch(err => {
                console.error('error', err);
                this.disabledButton = true;
            });
    }

    removeReview(id: number) {
        this.disabledButton = true;
        this.recipeService.deleteReview(this.recipe.id, id)
            .then(res => this.getReview())
            .catch(err => {
                console.error('error', err);
                this.disabledButton = false;
            });
    }

    editRecipe() {
        console.log('editRecipe value', this.recipe);
        this.createRecipeService.setDefaultValue(this.recipe);
        this.router.navigate(['recipes/create-basic']);
    }

    changeFavoriteState() {
        if (this.authService.isLogged() === false) {
            this.router.navigate(['recipes/favorite']);
        } else {
            this.disabledButton = true;
            this.recipeService.changeFavoriteState(this.recipeId, !this.recipe.favorite)
                .then(res => {
                    this.disabledButton = false;
                    this.recipe.favorite = !this.recipe.favorite;
                    this.recipe.favorite ? this.recipe.score++ : this.recipe.score--;
                })
                .catch(err => console.error('error', err));
        }  
    }

    addToFavorite() {
        this.disabledButton = true;
        this.recipeService.changeFavoriteState(this.recipeId, true)
            .then(res => {
                this.disabledButton = false;
                this.recipe.favorite = true;
                this.recipe.score++;
            })
            .catch(err => {
                console.error('error', err);
                this.disabledButton = false;
            });
    }

    removeFromFavorite() {
        this.disabledButton = true;
        this.recipeService.changeFavoriteState(this.recipeId, false)
            .then(res => {
                this.disabledButton = false;
                this.recipe.favorite = false;
                this.recipe.score--;
            })
            .catch(err => {
                console.error('error', err);
                this.disabledButton = false;
            });
    }

    sumbmitRecipe() {
        this.disabledButton = false;
        this.recipeService.submitRecipe(this.recipeId)
            .then(res => {
                this.translate.get('WEBSITE.RECIPE_MANAGEMENT.RECIPE_SUBMITED', { recipeName: this.recipe.name }).subscribe(res => {
                    this.disabledButton = false;
                    alert(res);
                }, err => {
                    console.error('TranslateError', err)
                    this.disabledButton = false;
                });
                this.recipe.status = 2;
            })
            .catch(err => {
                console.error('RecipeSubmitError', err);
                this.disabledButton = false;
            });
    }

    canWeShowShare(): void {
        const socialAccepted = Cookie.get(Constantes.COOKIE_SOCIAL_ACCEPTED);
        if (socialAccepted === 'true') {
            this.showShareModal = true;
        } else {
            this.alertService
                .showQuestion('COOKIE.SOCIAL.SHARE_EXPLICATION')
                .then((res) => {
                    if (res) {
                        //  Response is true so we launch share
                        //  And store response
                        Cookie.set(Constantes.COOKIE_SOCIAL_ACCEPTED, 'true');
                        this.showShareModal = true;
                    }
                })
                .catch((err) => {
                    //  ERROR, we can't know so it's no by default
                });
        }
    }

    onShareClose(close: boolean) {
        this.showShareModal = false;
    }

    unpublishRecipe() {
        this.recipeService.unpublishRecipe(this.recipeId)
            .then(res => {
                this.router.navigate(['recipes/all']);
            })
    }

    ngOnDestroy(){
        if(this.user_locale){
            this.translate.use(this.user_locale);
        }
    }
}
