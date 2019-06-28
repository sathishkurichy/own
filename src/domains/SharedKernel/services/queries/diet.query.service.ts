import { Injectable } from '@angular/core';
import { Headers, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { KeycloakService } from '../keycloak/keycloak.service';
import { LanguageService } from '../lang/language.service';
import { Api } from './../../../SharedKernel/core/api/api';
import { ApiResponse } from './../../../SharedKernel/core/api/api-response';
import { Diet } from './../../../SharedKernel/model/diet.model';
import { Connectivity } from './../../../SharedKernel/services/connectivity/connectivity.service';

@Injectable()
export class DietQueryService {

    constructor(public connectivity: Connectivity,
        public api: Api,
        private keycloakSrv: KeycloakService,
        private language: LanguageService) { }

    private token = () => {
        return this.keycloakSrv.keycloak.token;
    }

    getDiets(): Observable<ApiResponse<Diet[]>> {
        const dietsInformations$: Subject<ApiResponse<any>> = new Subject<ApiResponse<any>>();

        if (this.connectivity.isOffline()) {
            dietsInformations$.error({
                isError: true,
                reqData: {},
                respData: 'error offline'
            });
        }
        else {
            console.log('this.token()', this.token());
            let options: RequestOptionsArgs = null
            let params: string = '';
            if (this.token()) {
                let headers = new Headers();
                headers.append('Authorization', 'Bearer ' + this.token());
                options = JSON.parse('{ "headers": "" }');
                options.headers = headers;
            } else {
                console.log('this.language.currentLanguage()', this.language.currentLanguage());
                params = '?locale=' + this.language.currentLanguage();
            }
            this.api.get('/api/v1/diets/all' + params, options).subscribe((res: any) => {
                dietsInformations$.next({
                    isError: false,
                    reqData: {},
                    respData: <Diet[]>JSON.parse(res._body).payload.results,
                });
            },
                err => {
                    console.error('getDiets error', err);
                    dietsInformations$.error({
                        isError: true,
                        reqData: {},
                        respData: err
                    });
                });
        }
        return dietsInformations$;
    }
}