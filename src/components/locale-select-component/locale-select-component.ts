import { Component, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../services/user.service';
import { LocaleInDto } from '../../domains/SharedKernel/model/localeInDto.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'locale-select',
    templateUrl: './locale-select-component.html',
    styleUrls: ['./locale-select-component.scss']
})

export class LocaleSelectComponent {

    @Output() onLocaleChangeEvent = new EventEmitter();

    loadingLocale: boolean = false;
    locales: Array<LocaleInDto> = [];

    constructor(
        private userService: UserService,
        private translate: TranslateService,
    ) {
    }

    ngOnInit(){    
        console.log('hi');
        this.loadingLocale = true;
        this.userService.getAvailableLanguages()
            .then((res) => {
                this.locales = res;
                this.loadingLocale = false;
            })
            .catch((err) => {
                this.loadingLocale = false;
            });
    }

    onChange(locale: string): void{
        console.log("locale change", locale);
        this.onLocaleChangeEvent.emit(locale);
    }

}