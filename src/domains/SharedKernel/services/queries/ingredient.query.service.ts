import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { RequestOptionsArgs } from '@angular/http/src/interfaces';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Ingredient } from '../../../SharedKernel/model/ingredient.model';
import { Recipe } from '../../../SharedKernel/model/recipe.model';
import { Unit } from '../../model/unit.model';
import { KeycloakService } from '../keycloak/keycloak.service';
import { Api } from './../../../SharedKernel/core/api/api';
import { ApiResponse } from './../../../SharedKernel/core/api/api-response';
import { Connectivity } from './../../../SharedKernel/services/connectivity/connectivity.service';

@Injectable()
export class IngredientsQueryService {



    constructor(public connectivity: Connectivity,
        public api: Api,
        private keycloakSrv: KeycloakService) { }

    private token = () => {
        return this.keycloakSrv.keycloak.token;
    }

    getIngredients(payload: { autocomplete: string }): Observable<ApiResponse<Ingredient[]>> {
        const recipesInformations$: Subject<ApiResponse<any>> = new Subject<ApiResponse<any>>();

        if (this.connectivity.isOffline()) {
            recipesInformations$.error({
                isError: true,
                reqData: {},
                respData: 'error offline'
            });
        }
        else {
            let headers = new Headers();
            headers.append('Authorization', 'Bearer ' + this.token());

            let options: RequestOptionsArgs = JSON.parse('{ "headers": "" }');
            options.headers = headers;

            var params: string = 'autocomplete=' + payload.autocomplete + '&limit=3';

            this.api.get('/api/v1/ingredients/all?' + params, options).subscribe((res: any) => {
                recipesInformations$.next({
                    isError: false,
                    reqData: {},
                    respData: <Recipe[]>JSON.parse(res._body).payload.results,
                });
            },
                err => {
                    console.error('getIngredients error', err);
                    recipesInformations$.error({
                        isError: true,
                        reqData: {},
                        respData: err
                    });
                });
        }
        return recipesInformations$;
    }

    getUnitAll(): Promise<ApiResponse<Unit[]>> {
        return new Promise<ApiResponse<Unit[]>>((resolve, reject) => {
            if (this.connectivity.isOffline()) {
                reject({
                    isError: true,
                    reqData: {},
                    respData: 'error offline'
                });
            }
            else {
                let headers = new Headers();
                headers.append('Authorization', 'Bearer ' + this.token());
                let options: RequestOptionsArgs = JSON.parse('{ "headers": "" }');
                options.headers = headers;

                this.api.get('/api/v1/units/all', options).subscribe((res: any) => {
                    resolve({
                        isError: false,
                        reqData: {},
                        respData: <Unit[]>JSON.parse(res._body).payload.results,
                    });
                },
                    err => {
                        console.error('getUnitAll error', err);
                        reject({
                            isError: true,
                            reqData: {},
                            respData: err
                        });
                    });
            }
        });
    }
}