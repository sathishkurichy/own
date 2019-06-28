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
import {Constantes} from '../environments/environment';

@Injectable()
export class ApiService {

    url = Constantes.BACKEND_URL;

    constructor(private http: HttpClient) { }

    post(endpoint: string, body: any, reqOpts?: any) {
        console.log('APIPOST');
        return this.http.post(this.url + endpoint, body, reqOpts)
    }

    put(endpoint: string, body: any, reqOpts?: any) {
        console.log('APIPUT');
        return this.http.put(this.url + endpoint, body, reqOpts)
    }

    get(endpoint: string, reqOpts?: any) {
        console.log('APIGET');
        return this.http.get(this.url + endpoint, reqOpts)
    }

    delete(endpoint: string, reqOpts?: any) {
        console.log('APIDELETE');
        return this.http.delete(this.url + endpoint, reqOpts)
    }

    patch(endpoint: string, body: any, reqOpts?: any) {
        console.log('APIPATCH');
        return this.http.put(this.url + endpoint, body, reqOpts)
    }

    transferFile(endpoint, file: File, reqOpts){
        let formData: FormData = new FormData();
        formData.append('thumbnail_recipe', file, 'thumbnail_recipe');
        return new Promise((resolve, reject)=>{
            this.http.post(this.url + endpoint, formData).subscribe((res: any)=>{
                if(res.success){
                    resolve(res);
                }else{
                    reject(res);
                }
            }, err=>{
                reject(err);
            });
        })
    }
}
