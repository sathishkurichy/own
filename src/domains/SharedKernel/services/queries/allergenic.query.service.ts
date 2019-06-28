import { Injectable } from '@angular/core';
import { Headers, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { KeycloakService } from '../keycloak/keycloak.service';
import { LanguageService } from '../lang/language.service';
import { Api } from './../../../SharedKernel/core/api/api';
import { ApiResponse } from './../../../SharedKernel/core/api/api-response';
import { Allergy } from './../../../SharedKernel/model/allergy.model';
import { Connectivity } from './../../../SharedKernel/services/connectivity/connectivity.service';

@Injectable()
export class AllergenicQueryService {

    constructor(private connectivity: Connectivity,
        private api: Api,
        private language: LanguageService,
        private keycloakSrv: KeycloakService) { }

    private token = () => {
        return this.keycloakSrv.keycloak.token;
    }

    getAllergenics(payload: { autocomplete?: string, limit?: number }): Observable<ApiResponse<Allergy[]>> {

        const allergiesInformations$: Subject<ApiResponse<any>> = new Subject<ApiResponse<any>>();

        if (this.connectivity.isOffline()) {
            allergiesInformations$.error({
                isError: true,
                reqData: {},
                respData: 'error offline'
            });
        }
        else {
            var params: string = 'autocomplete=' + payload.autocomplete + '&limit=' + payload.limit;

            console.log('this.token()', this.token());
            let options: RequestOptionsArgs = null;
            if (this.token()) {
                let headers = new Headers();
                headers.append('Authorization', 'Bearer ' + this.token());
                options = JSON.parse('{ "headers": "" }');
                options.headers = headers;
            } else {
                console.log('this.language.currentLanguage()', this.language.currentLanguage());
                params += '&locale=' + this.language.currentLanguage();
            }

            this.api.get('/api/v1/allergenics/all?' + params, options).subscribe((res: any) => {
                allergiesInformations$.next({
                    isError: false,
                    reqData: {},
                    respData: <Allergy[]>JSON.parse(res._body).payload.results,
                });
            },
                err => {
                    console.error('getAllergenics error', err);
                    allergiesInformations$.error({
                        isError: true,
                        reqData: {},
                        respData: err
                    });
                });
        }
        return allergiesInformations$;
    }
}