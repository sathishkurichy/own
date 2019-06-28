import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { CreateRecipeService } from '../../../domains/RecipeManagement/services/create-recipe.service';
import { RecipeService } from '../../../domains/RecipeManagement/services/recipe.service';
import { AlertService } from './../../../services/alert.service';
import {faSpinner, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { LocaleInDto } from '../../../domains/SharedKernel/model/localeInDto.model';

@Component({
    selector: 'page-recipe-management',
    templateUrl: 'recipe-management.html',
    styleUrls: ['recipe-management.scss']
})
export class RecipeManagementPage {

    isOpen: boolean = false;

    @ViewChild('recipeMngTable') table: any;
    @ViewChild('cellActionTemplate') actionTemplate: any;

    recipes: Array<any> = [];
    columns = [];
    mobile: boolean = false;

    refusedReasonFormControl: FormControl;
    isBakingTimeAutoFormControl: FormControl;
    isForParentReferentFormControl: FormControl;
    isForFutureMomFormControl: FormControl;
    sameLocale = true;

    locale_translate: String = null;
    loadingRecipes: boolean = false;

  faTimesCircle = faTimesCircle;
  faSpinner = faSpinner;

  indexApproveOrRefuse : number = 0;

    constructor(private translate: TranslateService,
        private alertService: AlertService,
        private recipeService: RecipeService,
        private ngZone: NgZone,
        private router: Router,
        private createRecipeService: CreateRecipeService,
        public authService: AuthService,

        ) {
        this.mobile = false;
        this.refusedReasonFormControl = new FormControl(null, [Validators.required, Validators.minLength(3)])
        this.isBakingTimeAutoFormControl = new FormControl(null, [Validators.required])
        this.isForParentReferentFormControl = new FormControl(null, [Validators.required])
        this.isForFutureMomFormControl = new FormControl(null, [Validators.required])

    }

    ngOnInit(): void {

        let idTitle = "WEBSITE.USERS.TITLE_ID";
        let nameTitle = "WEBSITE.COMMON.RECIPE_NAME";
        let authorTitle = "WEBSITE.COMMON.AUTHOR";

        this.isBakingTimeAutoFormControl.setValue(true);

        this.translate.get([idTitle, nameTitle, authorTitle]).subscribe((res) => {
            this.columns = [
                { name: res[idTitle], prop: 'id' },
                { name: res[nameTitle], prop: 'name' },
                { name: res[authorTitle], prop: 'author' },
                { name: 'Actions', sortable: false, cellTemplate: this.actionTemplate },
            ];
            this.reloadData();
        });
    }

    reloadData(): void {
        this.loadingRecipes = true;
        this.recipeService.getPendingRecipes()
            .then((res) => {
                this.ngZone.run(() => {
                    this.recipes = res;
                    this.loadingRecipes = false;
                });
            })
            .catch((err) => {
                console.error('getRecipe error', err);
                this.ngZone.run(() => {
                    this.loadingRecipes = false;
                });
                this.alertService.showMessage("Béaba", "ERROR_MESSAGE.DEFAULT");
            });
    }

    onSeeRecipe(row): void {
        let url = "recipes/" + row.id + "/overview";

        if(!this.sameLocale){
           this.router.navigate([url, 
            {
                locale_translate: this.locale_translate
            }
        ]);
        }else{
            this.router.navigate([url]);
        }
    }

    onApproveRecipe(row): void {
        this.indexApproveOrRefuse = 0;
        this.table.rowDetail.collapseAllRows();
        this.table.rowDetail.toggleExpandRow(row);
    }
    onSendApprovedRecipe(row): void{
        console.log("onSendApprovedRecipe");
        let isBakingTimeAuto: string = this.isBakingTimeAutoFormControl.value;
        let isForParentReferent: string = this.isForParentReferentFormControl.value;
        let isForFutureMom: string = this.isForFutureMomFormControl.value;
        console.log("isBakingTimeAuto",isBakingTimeAuto);
        console.log("isForParentReferent",isForParentReferent);
        console.log("isForFutureMom",isForFutureMom);

        this.recipeService.postApproveModeration(row.id, isBakingTimeAuto, isForParentReferent, isForFutureMom)
            .then((res) => {
                this.reloadData();
            })
            .catch((err) => {
                this.reloadData();
                this.alertService.showMessage("Béaba", "ERROR_MESSAGE.DEFAULT");
            });
    }
    onRefuseRecipe(row): void {
        this.indexApproveOrRefuse = 1;
        this.table.rowDetail.collapseAllRows();
        this.table.rowDetail.toggleExpandRow(row);
    }

    onEditRecipe(row): void {
        this.recipeService.getRecipeOverview({id: row.id})
            .then((res) => {
                this.createRecipeService.setDefaultValue(res);
                this.router.navigate(['recipes/create-basic']);
            })
            .catch((err) => {
                console.error('editRecipe error', err);
                this.reloadData();
                this.alertService.showMessage("Béaba", "ERROR_MESSAGE.DEFAULT");
            });
    }

    onSendRefusedReason(row): void {
        let reason: string = this.refusedReasonFormControl.value;

        this.recipeService.postRefusedModeration(row.id, reason)
            .then((res) => {
                this.reloadData();
            })
            .catch((err) => {
                this.reloadData();
                this.alertService.showMessage("Béaba", "ERROR_MESSAGE.DEFAULT");
            });
    }

    onOpenRecipe(row): void {
        console.warn('TODO: onOpenRecipe');
    }

    onLocaleChange(locale: string): void{
        this.loadingRecipes = true;
        if(this.translate.currentLang == locale){
            this.sameLocale =true;
            this.locale_translate = null;
        }else{
            this.sameLocale =false;
            this.locale_translate = locale;
        }
        this.recipeService.getPendingRecipes(locale)
            .then((res) => {
                this.ngZone.run(() => {
                    this.recipes = res;
                    this.loadingRecipes = false;                    
                });
            })
            .catch((err) => {
                console.error('getRecipe error', err);
                this.ngZone.run(() => {
                    this.loadingRecipes = false;
                });
                this.alertService.showMessage("Béaba", "ERROR_MESSAGE.DEFAULT");
            });
        }
}
