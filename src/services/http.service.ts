import { Observable } from 'rxjs/Observable';
import { isUndefined } from 'util';
import { UserAuth } from './../domains/SharedKernel/model/userAuth.model';
import { RequestOptionsArgs, Http } from '@angular/http';
import { User } from './../domains/SharedKernel/model/user.model';
import { Api } from './../domains/SharedKernel/core/api/api';
import { Injectable } from '@angular/core';

import * as Keycloak from "keycloak-js";
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observer } from 'rxjs';

@Injectable()
export class HttpService {

    constructor(private http: HttpClient) { }

    post(endpoint: string, body: any, reqOpts?: any) {
        return this.http.post(endpoint, body, reqOpts)
    }

    put(endpoint: string, body: any, reqOpts?: any) {
        return this.http.put(endpoint, body, reqOpts)
    }

    get(endpoint: string, reqOpts?: any) {
        return this.http.get(endpoint, reqOpts)
    }

    delete(endpoint: string, reqOpts?: any) {
        return this.http.delete(endpoint, reqOpts)
    }

    patch(endpoint: string, body: any, reqOpts?: any) {
        return this.http.put(endpoint, body, reqOpts)
    }

}