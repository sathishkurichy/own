import 'rxjs/add/observable/timer';

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class LanguageService {

    constructor(private translate: TranslateService) { }

    currentBrowserLang(): string {
        if (this.translate.getBrowserCultureLang() !== undefined) {
            return this.translate.getBrowserCultureLang();
        }
        return 'en_US';
    }

    currentLanguage(): string {
        let cultureLang = this.currentBrowserLang();
        return this.langueToFilename(cultureLang);
    }

    langueToFilename(lang: string): string {
        switch (lang) {
            case "fr":
            case "fr-FR":
            case "fr_FR":
                return 'fr_FR';
            case "en_GB":
            case "en-GB":
                return 'en_UK';
            case "en":
            case "en_US":
            case "en-US":
                return 'en_US';
            case "zh_CN":
            case "zh-CN":
            case "cn":
                return 'zh_CN';
            case "zh_HK":
            case "zh-HK":
                return 'zh_HK';   
            case "es_ES":
            case "es-ES":
                return 'es_ES';  
            case "en_HK":
            case "en-HK":
                return 'en_HK';  
            default:
                return 'en_UK';
        }
    }

    langToDateFormat(lang: string) {
        switch (this.langueToFilename(lang)) {
            case 'fr_FR':
                return 'DD/MM/YYYY';
            case 'en_GB':
            case 'en_US':
            case 'zh_CN':
            case 'es_ES':
            case 'zh_HK':
            case 'en_HK':            
            default:
                return 'MM/DD/YYYY';
        }
    }
}