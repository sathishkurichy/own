import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

import { LocaleInDto } from '../../domains/SharedKernel/model/localeInDto.model';
import {
    RecipeOverviewOutDto,
    RecipeService,
    TranslateRecipePayload,
} from './../../domains/RecipeManagement/services/recipe.service';
import { AlertService } from './../../services/alert.service';
import { UserService } from './../../services/user.service';
import {forEach} from '@angular/router/src/utils/collection';
import {faSpinner, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'page-translator',
    templateUrl: 'translator.html',
    styleUrls: ['translator.scss']
})
export class TranslatorPage {

    translateFormGroup: FormGroup;

    error: boolean = false;
    loadingLocale: boolean = false;
    loadingRecipe: boolean = false;
    saving: boolean = false;
    isValid: boolean = false;

    locales: Array<LocaleInDto> = [];
    locale_translate:string = null;
    recipeId: number = 0;
    recipe: RecipeOverviewOutDto;
  faTimesCircle = faTimesCircle;
  faSpinner = faSpinner;

    constructor (private route: ActivatedRoute,
                 private recipeService: RecipeService,
                 private userService: UserService,
                 private alertService: AlertService,
                 private router: Router,
                 private translate: TranslateService,
                 private authService: AuthService) {

        this.translateFormGroup = new FormGroup({});

    }

    ngOnInit(): void {

        this.route.params.subscribe(params=>{

            const id = +params['id'];
            this.recipeId = id;

            if(params['locale_translate']){
                this.locale_translate = params['locale_translate'];
            }

            this.loadingLocale = true;
            this.userService.getAvailableLanguages()
                    .then((res) => {
                        this.locales = res;
                        this.loadingLocale = false;
                        this.reloadData();
                        this.onLocaleChange();
                    })
                    .catch((err) => {
                        this.loadingLocale = false;
                    });

        });

    }

    reloadData(): void {
        this.loadingRecipe = true;
        this.recipeService.getRecipeOverview({id: this.recipeId, locale_translate: this.locale_translate})
        .then((res) => {
          res.steps = this.sortSteps(res.steps);
            this.recipe = _.cloneDeep(res);
            this.translateFormGroup.controls = {};
            this.translateFormGroup.addControl('recipeLocaleFormControl', new FormControl("", Validators.required));
            this.translateFormGroup.addControl('recipeNameFormControl', new FormControl(res.name, Validators.required));


            res.steps.forEach((step) => {
                if (step.freeInstruction) {
                    let control = new FormControl("", [Validators.required]);
                    this.translateFormGroup.addControl('freeInstructionStep' + step.id, new FormControl(step.freeInstruction, Validators.required));
                }
            });
            this.translateFormGroup.controls["recipeLocaleFormControl"].setValue(this.locale_translate, {OnlySelf: true});
            this.error = false;
            this.loadingRecipe = false;


            if(this.translate.currentLang != this.translateFormGroup.controls["recipeLocaleFormControl"].value && !this.authService.isSuperTranslator()){
                this.translateFormGroup.controls["recipeLocaleFormControl"].setErrors({'incorrect': true});
            }else{
                this.translateFormGroup.controls["recipeLocaleFormControl"].setErrors(null);
            }
            this.isValid = this.translateFormGroup.valid;
        })
        .catch((err) => {
            this.recipe = null;
            this.error = true;
            this.loadingRecipe = false;
            this.alertService.showMessage("Béaba", "ERROR_MESSAGE.DEFAULT");
        });

    }

    onTraductClick(): void {

        this.saving = true;

        let savedSteps: Array<any> = [];

        this.recipe.steps.forEach((step) => {
            if (step.freeInstruction) {
                let control = this.translateFormGroup.controls["freeInstructionStep" + step.id];
                let value = control.value;
                savedSteps.push({
                    id: step.id,
                    freeInstruction: value
                });
            }
        });

        let payload: TranslateRecipePayload = {
            name: this.translateFormGroup.controls["recipeNameFormControl"].value,
            cookTip: "",
            recipeTip: "",
            locale: this.translateFormGroup.controls["recipeLocaleFormControl"].value,
            steps: savedSteps
        };

        this.recipeService.translateRecipe(this.recipeId, payload)
        .then((res) => {
            this.saving = false;
            this.router.navigate(["recipes/" + this.recipeId + "/overview"]);
        })
        .catch((err) => {
            this.saving = false;
            this.alertService.showMessage("Béaba", "ERROR_MESSAGE.DEFAULT");
        });

    }

  onLocaleChange(): void{
    if(this.translate.currentLang != this.translateFormGroup.controls["recipeLocaleFormControl"].value && !this.authService.isSuperTranslator()){
        this.translateFormGroup.controls["recipeLocaleFormControl"].setErrors({'incorrect': true});
    }else{
        this.translateFormGroup.controls["recipeLocaleFormControl"].setErrors(null);
    }
    this.isValid = this.translateFormGroup.valid;

      this.loadingRecipe = true;
    this.recipeService.getRecipeOverview({id: this.recipeId, locale_translate: this.translateFormGroup.controls["recipeLocaleFormControl"].value})
      .then((res) => {
        res.steps = this.sortSteps(res.steps);
        this.translateFormGroup.controls.recipeNameFormControl.setValue(res.name ? res.name : null);
        res.steps.forEach((step) => {
          this.translateFormGroup.controls["freeInstructionStep" + step.id].setValue(step.freeInstruction ? step.freeInstruction : null);
        });

        this.recipe = _.cloneDeep(res);


        this.error = false;
        this.loadingRecipe = false;

        this.translateFormGroup.updateValueAndValidity();
      })
      .catch((err) => {
        this.recipe = null;
        this.error = true;
        this.loadingRecipe = false;
        this.alertService.showMessage("Béaba", "ERROR_MESSAGE.DEFAULT");
      });
  }

  sortSteps(steps: Array<any>) {
    let newSteps = [];
    steps.forEach((step, index) => {
      newSteps[index] = steps.filter(step => step.stepIndex == index + 1)[0];
    });
    console.log('SORTED STEPS', newSteps);
    return newSteps;
  }

}
