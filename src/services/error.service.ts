import { Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AlertService} from './alert.service';

@Injectable()
export class ErrorService {

    constructor(private translate: TranslateService,
                private alertService: AlertService) { }

    showError(errorCode: number): void {
        const msg: string = this.getErrorMessageForCode(errorCode);
        this.alertService.showMessage('Béaba', msg);
    }

    private getErrorMessageForCode(code: number): string {
      switch (code) {
        default: return 'ERROR_MESSAGE.DEFAULT';
      }
    }

}
