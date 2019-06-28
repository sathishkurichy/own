import 'rxjs/add/observable/timer';

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
// import { Network } from '@ionic-native/network';
// import { Platform } from 'ionic-angular';
import * as Keycloak from 'keycloak-js';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { Api } from '../../core/api/api';
import {Constantes} from '../../../../environments/environment';

@Injectable()
export class KeycloakService {

    keycloak: any;
    isConnected: BehaviorSubject<any>;

    constructor(
        public api: Api,
        public http: Http) {

        console.warn('KeycloakService CONSTRUCTOR');

        this.isConnected = new BehaviorSubject<any>({});
        this.keycloak = Keycloak(Constantes.KEYCLOAK_CONFIG_FILE);

        Observable.timer(5000, 300000)
            .subscribe(() => {
                if (this.keycloak.authenticated) {
                    this.keycloak
                        .updateToken(15)
                        .success(() => {
                            this.keycloak.authenticated = true;
                        })
                        .error(error => {
                            console.error('UpdateTokenError', error);
                        });
                } else {
                    console.error('NOT AUTHENTICATED', this.keycloak);
                }
            });
        this.keycloak.onAuthSuccess = (() => {
            console.log("[Keycloak Service] onAuthSuccess");
            this.isConnected.next({
                success: true
            });
        });
        this.keycloak.onAuthError = (res => {
            console.error("[Keycloak Service] onAuthError", res);
            this.isConnected.next({
                success: false
            });
        });
    }

    init(options?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.keycloak.init(options)
                .success(() => {
                    resolve();
                })
                .error((errorData: any) => {
                    console.error('keycloak init error', errorData);
                    reject(errorData);
                });
        });
    }

    getConnexionStatus(): BehaviorSubject<any> {
        return this.isConnected;
    }

    isAuthenticated(): boolean {
        return this.keycloak.authenticated;
    }

    logout(): Promise<any> {
        return this.keycloak.logout();
    }

    getToken(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (this.keycloak.token) {
                this.keycloak
                    .updateToken(5)
                    .success(() => {
                        resolve(<string>this.keycloak.token);
                        this.keycloak.authenticated = true;
                    })
                    .error(err => {
                        console.error('updateToken Error', err);
                        reject('Failed to refresh token');
                    });
            }
            else {
                console.error('Not logged in');
                reject('Not logged in');
            }
        });
    }

    getProfile(): Promise<any> {
        return this.keycloak.loadUserProfile();
    }

    setToken(accessToken: string, refreshToken: string): void {
        this.keycloak.token = accessToken;
        this.keycloak.refreshToken = refreshToken;
        this.keycloak.authenticated = true;
    }

    facebookConnect(): Promise<string> {
        return this.keycloak.login({ idpHint: 'facebook' });
    }

    googleConnect(): Promise<string> {
        return this.keycloak.login({ idpHint: 'google' });
    }
}
