import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '../../../../../services/alert.service';
import { CreateRecipeService } from '../../../../../domains/RecipeManagement/services/create-recipe.service';

@Component({
    selector: 'create-recipe-basic-form-component',
    templateUrl: 'create-recipe-basic-form-component.html',
    styleUrls: ['create-recipe-basic-form-component.scss']
})
export class CreateRecipeBasicFormComponent {
    seasonSelected: boolean = false;
    disabledButton: boolean = false;
    fileReader: FileReader = new FileReader();

    constructor(private createRecipeService: CreateRecipeService, private translate: TranslateService, private alert: AlertService) { }

    @Input() basicInfo: FormGroup;

    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();

    ngOnInit(){
        this.basicInfo.valueChanges.subscribe(res=>{
            this.valid.emit(( this.basicInfo.valid == true && res.summer == true || res.fall == true || res.winter == true || res.spring == true ));
        });
        this.basicInfo.updateValueAndValidity();
    }

    pictureChange(event) {
        console.log('event.size', event.srcElement.files[0]);
        if (event.srcElement.files[0]) {
            this.disabledButton = true;
            if (event.srcElement.files[0].size >= 2097152) {
                console.warn('File too big');
                this.translate.get('ERROR.FILE_TOO_BIG').subscribe(res => {
                    console.log('translate OK');
                    let fileAlert = this.alert.showMessage('Béaba', res);
                    this.disabledButton = false;
                }, err => {
                    console.error('translate ERROR', err);
                    this.disabledButton = false;
                });
            } else {
                this.fileReader.onloadend = () => {
                    this.createRecipeService.setTmpThumbnail(this.fileReader.result);
                    this.disabledButton = false;
                };
                this.basicInfo.controls.thumbnail.setValue(event.srcElement.files[0]);
                this.fileReader.readAsDataURL(event.srcElement.files[0]);
            }
        }
    }
}