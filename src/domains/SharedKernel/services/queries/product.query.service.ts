import { Injectable } from '@angular/core';
import { Headers, RequestOptionsArgs } from '@angular/http';
// import { FileUploadOptions } from '@ionic-native/file-transfer';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { KeycloakService } from '../keycloak/keycloak.service';
import { Api } from './../../../SharedKernel/core/api/api';
import { ApiResponse } from './../../../SharedKernel/core/api/api-response';
import { Connectivity } from './../../../SharedKernel/services/connectivity/connectivity.service';
import { ProductInDto } from './../../model/productInDto.model';


@Injectable()
export class ProductQueryService {

    private token = () => {
        return this.keycloakSrv.keycloak.token;
    }
    constructor(public connectivity: Connectivity,
        public api: Api,
        private keycloakSrv: KeycloakService) {

    }

    createProduct(payload: ProductInDto): Observable<ApiResponse<any>> {
        const prouctInformation$: Subject<ApiResponse<any>> = new Subject<ApiResponse<any>>();
        if (this.connectivity.isOffline()) {
            prouctInformation$.error({
                isError: true,
                reqData: {},
                respData: 'error offline'
            });
        }
        else {

            let endpoint = '/api/v1/products';

            let headers = new Headers();
            headers.append('Authorization', 'Bearer ' + this.token());

            let options: RequestOptionsArgs = JSON.parse('{ "headers": "" }');
            options.headers = headers;

            this.api.post(endpoint, payload, options).subscribe(
                (res) => {
                    let result = JSON.parse(res["_body"]);
                    if (result.success) {
                        let productOutDto = {
                            id: result.payload.id,
                            name: result.payload.name,
                            serialNumber: result.payload.serialNumber,
                            firmwareVersion: result.payload.firmwareVersion,
                            purchaseDate: result.payload.purchaseDate
                        }
                        prouctInformation$.next({
                            isError: false,
                            reqData: payload,
                            respData: {
                                success: true,
                                product: productOutDto
                            }
                        });
                    }
                    else {
                        prouctInformation$.next({
                            isError: true,
                            reqData: payload,
                            respData: {}
                        });
                    }
                },
                (err) => {
                    prouctInformation$.error({
                        isError: true,
                        reqData: payload,
                        respData: {}
                    })
                }
            );
        }
        return prouctInformation$;
    }

    uploadProofOfPurchase(payload: { productId: number, pictureURI: string }): Observable<ApiResponse<any>> {
        const prouctInformation$: Subject<ApiResponse<any>> = new Subject<ApiResponse<any>>();
        if (this.connectivity.isOffline()) {
            prouctInformation$.error({
                isError: true,
                reqData: {},
                respData: 'error offline'
            });
        }
        else {

            let opts = {
                fileKey: 'product_purchase',
                fileName: 'ticket',
                chunkedMode: false,
                mimeType: "image/jpeg",
                headers: {
                    "Authorization": "Bearer " + this.token()
                }
            }

            /*this.api
                .transferFile(payload.pictureURI, "/api/v1/products/" + payload.productId + "/purchase", opts)
                .then((res) => {
                    prouctInformation$.next({
                        isError: false,
                        reqData: payload,
                        respData: {
                            success: true
                        }
                    })
                })
                .catch((err) => {
                    prouctInformation$.error({
                        isError: true,
                        reqData: payload,
                        respData: {
                            success: false,
                            err: err
                        }
                    })
                });*/

        }
        return prouctInformation$;
    }

    getGaranty(serialNumber: string): Promise<any> {

        return new Promise((resolve, reject) => {

            this.keycloakSrv.getToken()
                .then((res) => {

                    let headers = new Headers();
                    headers.append('Authorization', 'Bearer ' + res);

                    let options: RequestOptionsArgs = JSON.parse('{ "headers": "" }');
                    options.headers = headers;

                    this.api
                        .get('/api/v1/products/transfer/' + serialNumber, options).toPromise()
                        .then((res) => {
                            let result = JSON.parse(res["_body"]);
                            if (result.success) {
                                resolve(true);
                            }
                            else {
                                reject(false);
                            }
                        })
                        .catch((err) => {
                            console.error("GET GARANTY ERR ", err);
                            reject(false);
                        });

                })
                .catch((err) => {
                    reject(false);
                });

        });
    }


    getProducts(): Promise<any> {

        return new Promise((resolve, reject) => {

            this.keycloakSrv.getToken()
                .then((res) => {

                    let headers = new Headers();
                    headers.append('Authorization', 'Bearer ' + res);

                    let options: RequestOptionsArgs = JSON.parse('{ "headers": "" }');
                    options.headers = headers;

                    this.api
                        .get('/api/v1/products', options).toPromise()
                        .then((res) => {
                            let result = JSON.parse(res["_body"]);
                            if (result.success) {
                                resolve(true);
                            }
                            else {
                                reject(false);
                            }
                        })
                        .catch((err) => {
                            console.error("GET GARANTY ERR ", err);
                            reject(false);
                        });

                })
                .catch((err) => {
                    reject(false);
                });

        });
    }

}
