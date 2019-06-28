import { TranslateService } from '@ngx-translate/core';
import { UserAuth } from './../domains/SharedKernel/model/userAuth.model';
import { RequestOptionsArgs } from '@angular/http';
import { User } from './../domains/SharedKernel/model/user.model';
import { Api } from './../domains/SharedKernel/core/api/api';
import { Injectable } from '@angular/core';

import * as Keycloak from "keycloak-js";
//import { AlertController } from 'ionic-angular/components/alert/alert-controller';
//import { LoadingController } from 'ionic-angular';

@Injectable()
export class AlertService {

    constructor(private translate: TranslateService) {

    }

    showMessage(title: string, message: string): void {
        this.translate.get([title, message]).subscribe((res) => {
            /*let alert = this.alertCtrl.create({
                title: title,
                subTitle: message,
                buttons: ['Ok']
            });
            alert.present();*/
            alert(res[message]);
        });
    }

    showQuestion(message: string): Promise<boolean> {
        const promize = new Promise<boolean>((resolve, reject) => {
            this.translate.get([message]).subscribe((res) => {
                const confirmValue = confirm(res[message]);
                resolve(confirmValue);
            }, (err) => { reject(false); });
        });
        return promize;
    }

    showSpinner(): void {
        /*const loadingSpinner = this.loadingCtrl.create({
            spinner: 'crescent'
        });
        loadingSpinner.present();*/
    }

}
