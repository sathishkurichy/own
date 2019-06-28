import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'select-form-modal',
    templateUrl: 'select-form-modal.html',
    styleUrls: ['select-form-modal.scss']
})
export class SelectFormModal {
    
    @Output() onSelect = new EventEmitter<any>();
    @Output() onBackgroundClick = new EventEmitter<void>();
    @Input() list: Array<any>;
    form: FormControl;
    translate: boolean = false;

    constructor(){
        
    }

    ngOnInit(){
        if(typeof this.list[0] == 'string'){
            this.translate = true;
        }else{
            this.translate = false;
        }
        this.form = new FormControl(null);
        this.form.valueChanges.subscribe(res=>{
            this.onSelect.emit(res);
        });
    }

    backgroundClick(): void {
        this.onBackgroundClick.emit();
    }
}