import { Injectable } from '@angular/core';
import { Headers, RequestOptionsArgs } from '@angular/http';
//import { AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Api } from '../../core/api/api';
import { ApiResponse } from '../../core/api/api-response';

@Injectable()
export class PasswordService {

    constructor(public api: Api) { }

    sendForgetPassword(email: string): Observable<any> {

        const forgotPass$: Subject<ApiResponse<any>> = new Subject<ApiResponse<any>>();

        let endpoint: string = "/api/v1/keycloak";

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let options: RequestOptionsArgs = JSON.parse('{ "headers": "" }');
        options.headers = headers;

        this.api.post(endpoint, JSON.stringify({ email: email }), options)
            .subscribe(
                (res) => {
                    let response = res.json();
                    if (response.success) {
                        forgotPass$.next({
                            isError: false,
                            reqData: {},
                            respData: res.json()
                        });
                    }
                    else {
                        forgotPass$.error({
                            isError: true,
                            reqData: {},
                            respData: {}
                        })
                    }
                },
                (err) => {
                    forgotPass$.error({
                        isError: true,
                        reqData: {},
                        respData: err
                    });
                });

        return forgotPass$;
    }
}