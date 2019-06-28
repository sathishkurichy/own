import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs } from '@angular/http';
import {Constantes} from '../../../../environments/environment';

/**
 * Api is a generic REST Api handler. Set your API url first..
 */
@Injectable()
export class ApiCore {

    url = Constantes.BACKEND_URL;

    constructor(private http: Http) { }

    post(endpoint: string, body: any, reqOpts?: any) {
        return this.http.post(this.url + endpoint, body, reqOpts)
    }

    put(endpoint: string, body: any, reqOpts?: any) {
        return this.http.put(this.url + endpoint, body, reqOpts)
    }

    get(endpoint: string, reqOpts?: RequestOptionsArgs) {
        return this.http.get(this.url + endpoint, reqOpts)
    }

    delete(endpoint: string, reqOpts?: any) {
        return this.http.delete(this.url + endpoint, reqOpts)
    }

    patch(endpoint: string, body: any, reqOpts?: any) {
        return this.http.put(this.url + endpoint, body, reqOpts)
    }
}
