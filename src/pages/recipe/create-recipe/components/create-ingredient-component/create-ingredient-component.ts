import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { IngredientVm } from '../../../../../domains/RecipeManagement/services/create-recipe.service';
import { RecipeService } from '../../../../../domains/RecipeManagement/services/recipe.service';
import { IngredientOutDto } from '../../../../../domains/SharedKernel/model/ingredientOutDto.model';
import { UnitOutDto } from '../../../../../domains/SharedKernel/model/unitOutDto.model';
import { UNITS } from '../../../../../domains/SharedKernel/model/units.model';
import {UserService} from '../../../../../services/user.service';

import { faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'create-ingredient-component',
    templateUrl: 'create-ingredient-component.html',
    styleUrls: ['create-ingredient-component.scss']
})
export class CreateIngredientComponent {

    @Input() ingredients: Array<IngredientVm>;
    @Input() disabledButton: boolean;
    @Output() ingredientEmitter = new EventEmitter<Array<IngredientVm>>();
    searching: boolean = false;
    creatingIngredient: boolean = false;
    ingredientControl: FormControl;
    quantityControl: FormControl;
    unitControl: FormControl;
    units: Array<UnitOutDto> = [];
    ingredientCompletion: Array<IngredientOutDto> = [];
    focus: boolean = false;
    currentIngredient: IngredientOutDto;
    ingredientValid: boolean = false;
    unitTmp: UnitOutDto;
    quantity: Array<number> = new Array<number>();
    locale: string;
    
    faTimes = faTimes;
    faSpinner = faSpinner;
    
    constructor(
      private recipeService: RecipeService,
      private user: UserService
    ) {
      user.getUser().then(res => {
        console.log("[MODIFY] user", res.payload);

        this.locale = res.payload.locale;
      });
    }

    ngOnInit() {
        this.initForms();
        this.recipeService.getUnitAll().then(units => {
          console.log("[MODIFY] unitALL", this.unitTmp);

          this.units = units;
          console.log("[MODIFY] units", this.units);
            this.ingredients.map(ingredient => ingredient.unit = <UnitOutDto>units.filter(unit => ingredient.unit.id === unit.id)[0]);
            this.unitTmp = units.filter(unit => unit.default == true)[0];

        });
        this.initQuantity();
        console.log("[MODIFY] ingredients", this.ingredients);

    }

    initQuantity(): void {
        this.quantity.push(5);
        for (let i = 10; i < 100; i++) {
            if (i % 5 === 0) {
                this.quantity.push(i);
            }
        }
        for (let i = 100; i <= 500; i++) {
            if (i % 10 === 0) {
                this.quantity.push(i);
            }
        }
    }

    addIngredient() {
        this.creatingIngredient = true;
    }

    validIngredient() {
        this.ingredients.push({
            ingredient: this.currentIngredient,
            quantity: <number>this.quantityControl.value,
            unit: this.unitControl.value,
            preparation: this.currentIngredient.preparation
        });
        this.initForms();
        this.creatingIngredient = false;
    }

    cancelIngredient() {
        this.initForms();
        this.creatingIngredient = false;
    }

    selectIngredient(ingredient: IngredientOutDto) {
        setTimeout(() => {
            this.ingredientValid = true;
        }, 100);
        this.currentIngredient = ingredient;
        this.ingredientCompletion = [];
        this.ingredientControl.setValue(ingredient.name);
        this.unitControl.enable();

        if (this.currentIngredient.unitWeight == null) {
            this.units = <UnitOutDto[]>this.units.filter(unit => unit.id != 1);
            console.log('newUnit', this.units);
        } else {
            if (this.units.filter(unit => unit.id == 1).length == 0) {
                this.units.push(this.unitTmp);
                this.units.sort((a, b) => {
                    if (a.id < b.id) {
                        return -1;
                    } else {
                        return 1;
                    }
                });
                console.log('newUnit', this.units);
            }
        }
    }

    removeIngredient(ingredient: IngredientOutDto) {
        this.ingredients = this.ingredients.filter(res => res.ingredient.id !== ingredient.id);
        this.ingredientEmitter.emit(this.ingredients);
    }

    ingredientInputBlur() {
        setTimeout(() => {
            this.focus = false;
        }, 200);
    }

    initForms() {

        this.currentIngredient = null;

        this.ingredientControl = new FormControl('', Validators.required);
        this.unitControl = new FormControl({ value: 'n/a', disabled: true }, Validators.required);
        this.quantityControl = new FormControl({ value: 'n/a', disabled: true }, Validators.required);

        this.ingredientControl.valueChanges
            .do((res) => {
                this.searching = true;
                this.ingredientValid = false;
            })
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe((res) => {
                if (res === '') {
                    this.ingredientCompletion = [];
                    this.searching = false;
                    this.disableUnitControl();
                } else {
                    this.recipeService.getIngredients({
                        autocomplete: res
                    }).then(list => {
                        this.ingredientCompletion = <Array<IngredientOutDto>>list;
                        this.searching = false;
                    }).catch(err => {
                        console.error('Err looking for ingredients', err);
                        this.searching = false;
                        this.disableUnitControl();
                    });
                }
            }, (err) => {
                console.error('Err looking for ingredients', err);
                this.disableUnitControl();
            });

        this.unitControl.valueChanges.subscribe((res) => {
            this.setQuantity(res.id);
            if (res === null || res === 'n/a' || res === '' || res === ' ') {
                this.disableQuantityControl();
            } else {
                this.quantityControl.enable();
            }
        });
    }

    _keyPress(event: any) {
        if (event.charCode !== 0) {
            if (!/[0-9]/.test(String.fromCharCode(event.charCode))) {
                // invalid character, prevent input
                event.preventDefault();
            }
        }
    }

    disableUnitControl(): void {
        this.unitControl.setValue('');
        this.unitControl.disable();
    }

    disableQuantityControl(): void {
        this.quantityControl.setValue('');
        this.quantityControl.disable();
    }

    setQuantity(unitId: number) {
        this.quantity = [];
        switch (unitId) {
            case UNITS.UNITE:
                this.quantity.push(1 / 4);
                this.quantity.push(1 / 2);
                this.quantity.push(3 / 4);
                for (let i = 1; i < 10; i++) {
                    this.quantity.push(i);
                }
                break;
            case UNITS.GRAMME:
                this.quantity.push(5);
                break;
            case UNITS.ML:
                this.quantity.push(5);
                break;
            case UNITS.CAC:
                this.quantity.push(1 / 4);
                this.quantity.push(1 / 2);
                this.quantity.push(3 / 4);
                for (let i = 1; i < 10; i++) {
                    this.quantity.push(i);
                }
                break;
            case UNITS.CAS:
                this.quantity.push(1 / 4);
                this.quantity.push(1 / 2);
                this.quantity.push(3 / 4);
                for (let i = 1; i < 10; i++) {
                    this.quantity.push(i);
                }
                break;
            case UNITS.TASSE:
                this.quantity.push(1 / 4);
                this.quantity.push(0.33);
                this.quantity.push(1 / 2);
                this.quantity.push(0.66);
                this.quantity.push(3 / 4);
                for (let i = 1; i < 10; i++) {
                    this.quantity.push(i);
                }
                break;
            default:
                for (let i = 1; i < 10; i++) {
                    this.quantity.push(i);
                }
                break;
        }
        for (let i = 10; i < 100; i++) {
            if (i % 5 == 0) {
                this.quantity.push(i);
            }
        }
        for (let i = 100; i <= 500; i++) {
            if (i % 10 == 0) {
                this.quantity.push(i);
            }
        }
    }
}
