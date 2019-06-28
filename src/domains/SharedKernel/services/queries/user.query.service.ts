import { Injectable } from '@angular/core';
import { Headers, RequestOptionsArgs } from '@angular/http';

import { KeycloakService } from '../keycloak/keycloak.service';
import { Api } from './../../../SharedKernel/core/api/api';
import { Connectivity } from './../../../SharedKernel/services/connectivity/connectivity.service';
import { Allergy } from './../../model/allergy.model';
import { Diet } from './../../model/diet.model';

export interface GetRecipeCommandPayload {
    page: number,
    allergenics?: Array<Allergy>,
    diets?: Array<Diet>,
    orderBy?: string,
    sort?: string
}

@Injectable()
export class UserQueryService {

    constructor(public connectivity: Connectivity,
        public api: Api,
        private keycloakSrv: KeycloakService) {
    }

    private token = () => {
        return this.keycloakSrv.keycloak.token;
    }

    disableAccount(): Promise<boolean> {

        const myPromise = new Promise<boolean>((resolve, reject) => {

            if (this.connectivity.isOffline()) {

                reject(false);

            } else {

                let endpoint: string = '/api/v1/reviews/disable';

                let headers = new Headers();
                headers.append('Authorization', 'Bearer ' + this.token());

                let options: RequestOptionsArgs = JSON.parse('{ "headers": "" }');
                options.headers = headers;

                this.api.delete(endpoint, options)
                    .subscribe((res) => {
                        const result = JSON.parse(res["_body"]);
                        if (result.success) {
                            resolve(true);
                        } else {
                            reject(false);
                        }
                    }, (err) => {
                        reject(false);
                    })

            }
        });

        return myPromise;

    }

}
