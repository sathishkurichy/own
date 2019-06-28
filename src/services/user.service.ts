import { Injectable, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';

import { ApiService } from './api.service';
import { HttpService } from './http.service';
import {forEach} from '@angular/router/src/utils/collection';
import {Constantes} from '../environments/environment';

@Injectable()
export class UserService {

    token: string = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJaOHdabUtiNlIxSWNUMmV4bENCTS0xeEhmT3lVVFVuYmJrdEMwSVpGSm5rIn0.eyJqdGkiOiI0MGJiMjY5Zi1hOTgyLTQ3MzAtYTg3MS1jMGI3NjcyZDc0Y2UiLCJleHAiOjE1MTk2NDczODcsIm5iZiI6MCwiaWF0IjoxNTE5NjQ3MDg3LCJpc3MiOiJodHRwczovL2F1dGguYmVhYmEuY29tL2F1dGgvcmVhbG1zL2JlYWJhX2RldiIsImF1ZCI6ImJlYWJhLW1vYmlsZSIsInN1YiI6IjIwMWEzN2EzLWY2YjEtNDY3My05NGZmLWY0YjlkODdjZjc3YyIsInR5cCI6IkJlYXJlciIsImF6cCI6ImJlYWJhLW1vYmlsZSIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6IjRlMjQ0YTUyLWNlNTgtNGRkMi1iMDNmLWE2ODBjMGE4M2IzYiIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsicGFyZW50IiwiYWRtaW4iLCJ1bWFfYXV0aG9yaXphdGlvbiIsInVzZXIiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50Iiwidmlldy1wcm9maWxlIl19fSwibmFtZSI6IldpdGVraW9UZXN0IFdpdGVraW9UZXN0IiwicHJlZmVycmVkX3VzZXJuYW1lIjoid2l0ZWtpb3Rlc3QiLCJnaXZlbl9uYW1lIjoiV2l0ZWtpb1Rlc3QiLCJmYW1pbHlfbmFtZSI6IldpdGVraW9UZXN0IiwiZW1haWwiOiJqYmVuZXRodWlsaWVyZUB3aXRla2lvLmNvbSJ9.UXxCwiZpL199VgXdEFaZu1u-WZpflO8lU4a9c4LqhcMVrPiZZ9mMF5JL3Y2O_4OZjRXd93TPZqUWd5D1xyTNF6no20Pe42uPCkjGqq4D-vYs32oH7yGXq3JclEIoCpGaG_hSGieox1RYnUkIEZeGsy7OZkgQIeZ0AT7PfzNiOOPcfvo0snRXY141BXA_5yFbWw5KWjJMkYy4GtquN1bgInlnHhX6C71hA22ezrzC6BMrTLLYZMBlDarV_Y67tajV4CrS3Xb-XtTsnMItus33q5LTjFEcMjVaCD954hbOWoYHkXsmpZOE2kDhEa8ML2IntKEP98fv-DCJCj4X_7KfAw";

    runInBrowser: boolean = false;
    constructor(public apiService: ApiService,
        private httpService: HttpService,
        private translate: TranslateService,
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(APP_ID) private appId: string)
    {
        this.runInBrowser = isPlatformBrowser(platformId);
    }

    public getAllUser(): Promise<any> {

        return new Promise((resolve, reject) => {

            this.apiService.get('/api/v1/users/all', {}).toPromise()
                .then((res) => {
                    let result: any = res;
                    if (result.success) {
                        let users = result.payload.results;
                        resolve(users);
                    }
                    else {
                        reject(false);
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });

    }

    public getAllProducts(locale?: string): Promise<any> {

        return new Promise((resolve, reject) => {

            let url = '/api/v1/products/all';
            if(locale){
                url += "?locale=" + locale;
            }
            this.apiService.get(url, {}).toPromise()
                .then((res) => {
                    let result: any = res;
                    if (result.success) {
                        let users = result.payload.results;
                        resolve(users);
                    }
                    else {
                        reject(false);
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });

    }

    public getKeycloakUser(keycloakUserId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!keycloakUserId) {
                reject(false);
            }
            this.apiService.get('/api/v1/users/keycloak/'+keycloakUserId, {}).toPromise()
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(false);
                });
        });
    }

    public getRoles(keycloakUserId: string): Promise<any> {

        return new Promise((resolve, reject) => {

            if (!keycloakUserId) {
                reject(false);
            }
            this.apiService.get('/api/v1/users/roles/'+ keycloakUserId , {}).toPromise()
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(false);
                });
        });

    }
    public addParentReferentRole(keycloakUserId: string): Promise<any> {

        return new Promise((resolve, reject) => {

            if (!keycloakUserId) {
                reject(false);
            }
            let body = [
                {
                    "id": Constantes.KEYCLOAK_ROLE_PARENT_REFERENT,
                    "name" :"parent_referent"
                }
            ];
            this.apiService.post('/api/v1/users/roles/'+ keycloakUserId, body).toPromise()
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(false);
            });
        });
    }

    public removeParentReferentRole(keycloakUserId: string): Promise<any> {

        return new Promise((resolve, reject) => {

            if (!keycloakUserId) {
                reject(false);
            }
           
            let body =
                {
                    header: {
                        'Content-Type':  'application/json'
                    },
                    body: [{
                        "id": Constantes.KEYCLOAK_ROLE_PARENT_REFERENT,
                        "name": "parent_referent"
                    }]
                }
            ;
            this.apiService.delete('/api/v1/users/roles/'+ keycloakUserId, body).toPromise()
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(false);
            });
        });

    }

    public updateKeycloakUserState(keycloakUserId: string, enabled: boolean): Promise<any> {

        return new Promise((resolve, reject) => {

            if (!keycloakUserId) {
                reject(false);
            }
            console.log("keycloakUserId",keycloakUserId);
            this.apiService.put('/api/v1/users/keycloak/'+ keycloakUserId + '/enable/' + enabled,{}).toPromise()
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(false);
            });
        });

    }

    public createUserIfNeeded(): Promise<any> {

        return new Promise((resolve, reject) => {

            let language = "";
            const userLang = this.runInBrowser ? navigator.language : "";
            switch (userLang) {
                case "fr":
                    language = "fr_FR";
                    break;
                case "en-GB":
                case "en-US":
                    language = "en_US";
                    break;
                case "zh-CN":
                    language = "zh_CN"
                    break;
                case "zh-HK":
                    language = "zh_HK";
                    break;
                case "es-ES":
                    language = "es_ES";
                    break;
                default:
                    language = "en_US";
                    break;
            }

            this.apiService.post('/api/v1/users/verification', { locale: language }, {}).toPromise()
                .then((res) => {
                    resolve(true);
                })
                .catch((err) => {
                    reject(false);
                });

        });

    }

    navigatorLanguageToLocale(): string {
        const navLang = this.runInBrowser ? navigator.language : "";
        switch (navLang) {
            case 'fr':
            case 'fr_FR':
            case 'fr-FR':
                return 'fr_FR';
            case 'en-GB':
            case 'en_GB':
            case 'en-UK':
            case 'en_UK':
                return 'en_UK';
            case 'en-US':
            case 'en_US':
            case 'en':
                return 'en_US';
            case 'cn':
            case 'zh-CN':
            case 'zh_CN':
                return 'zh_CN';
            case 'zh-HK':
            case 'zh_HK':
                return 'zh_HK';
            case 'es':
            case 'es_ES':
            case 'es-ES':
                return 'es_ES';    
            default: return 'en_US';
        }
    }

    public getUser(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.apiService.get('/api/v1/users', {}).toPromise()
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    console.error("GET USER ERROR ", err);
                    reject(err);
                });
        });
    }

    public updateLanguage(locale: string): void {
        let lang: string = "en";
        console.log("updateLanguage",locale);

        switch (locale) {
            case "en-US":
            case "en_US":
                lang = "en_US";
                break;
            case "en-UK":
            case "en_UK":
            case "en-GB":
            case "en_GB":
                lang = "en_UK";
                break;
            case "fr_FR":
            case "fr-FR":
                lang = "fr_FR";
                break;
            case "es_ES":
            case "es-ES":
                lang = "es_ES";
                break;
            case "zh_CN":
            case "zh-CN":
                lang = "zh_CN";
                break;
            case "zh-HK":
            case "zh_HK":
                lang = "zh_HK";
                break;
        }
        console.log("UPDATE LANG USER",lang);
        this.translate.use(lang);
    }

    public getAvailableLanguages(): Promise<any> {
        let myPromise = new Promise((resolve, reject) => {
            this.apiService.get('/api/v1/cultures/all', {}).toPromise()
                .then((res) => {
                    let result: any = res;
                    if (result.success) {
                        resolve(result.payload.results);
                    }
                    else {
                        reject(false);
                    }
                })
                .catch((err) => {
                    reject(err);
                });

        });
        return myPromise;
    }

    public enableUser(userId: number): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.apiService.post('/api/v1/users/admin/enable/' + userId, {}).toPromise()
                .then((res) => {
                    console.log("RES ", res);
                    const result: any = res;
                    if (result.success) {
                        resolve(true);
                    } else {
                        reject(false);
                    }
                })
                .catch((err) => {
                    console.log("ERR ", err);
                    reject(err);
                });
        });
    }

    public disableUser(userId: number): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.apiService.delete('/api/v1/users/admin/disable/' + userId, {}).toPromise()
                .then((res) => {
                    const result: any = res;
                    if (result.success) {
                        resolve(true);
                    } else {
                        reject(false);
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

}
