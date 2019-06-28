import { ApiService } from './api.service';
import { UserService } from './user.service';
import { Observable } from 'rxjs/Observable';
import { isUndefined } from 'util';
import { UserAuth } from './../domains/SharedKernel/model/userAuth.model';
import { RequestOptionsArgs, Http } from '@angular/http';
import { User } from './../domains/SharedKernel/model/user.model';
import { Api } from './../domains/SharedKernel/core/api/api';

import { Injectable,  PLATFORM_ID, APP_ID, Inject  } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import * as Keycloak from "keycloak-js";
import { HttpHeaders } from '@angular/common/http';
import { Observer } from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {Constantes} from '../environments/environment';


@Injectable()
export class AuthService {

    user: User;
    keycloakAuth: any = {};
    bearerExcludedUrls: string[];
    runInBrowser: boolean = false;

    constructor (private userService: UserService,
                 private translate: TranslateService,
                 @Inject(PLATFORM_ID) private platformId: Object,
                 @Inject(APP_ID) private appId: string
                )
    {
        this.runInBrowser = isPlatformBrowser(platformId);
        const platform = isPlatformBrowser(platformId) ? 'in the browser' : 'on the server';
        console.log(`Running ${platform} with appId=${appId}`);
    }

    init(): Promise<any> {
        if (this.runInBrowser) {
        this.keycloakAuth = Keycloak(Constantes.KEYCLOAK_CONFIG_FILE);
        this.keycloakAuth.onAuthSuccess = (() => {
            this.userService.createUserIfNeeded()
            .then((res) => {
                console.log("[CREATE USER IF NEEDED] - THEN ", res);
                this.userService.getUser()
                .then((getUserRes) => {
                    this.user = getUserRes.payload;
                    this.userService.updateLanguage(this.user.locale);
                })
                .catch(getUserErr => {
                    //  An error occured
                    //  Show generic error message and LOGOUT
                    console.error('AuthService getUser', getUserErr);
                    const errorMsg = 'ERROR_MESSAGE.DEFAULT';
                    this.translate.get([errorMsg]).subscribe((res) => {
                        alert(res[errorMsg]);
                    });
                    this.logout();
                });
            })
            .catch(err => {
                //  An error occured
                //  Show generic error message and LOGOUT
                console.error('AuthService createUserIfNeeded', err);
                console.log("[CREATE USER IF NEEDED] - CATCH");
                const errorMsg = 'ERROR_MESSAGE.DEFAULT';
                this.translate.get([errorMsg]).subscribe((res) => {
                    alert(res[errorMsg]);
                });
                this.logout();
            });
        });
        this.keycloakAuth.loggedIn = false;

        return new Promise((resolve, reject) => {
            this.keycloakAuth.init({ })
                .success(() => {
                    this.keycloakAuth.loggedIn = true;
                    this.keycloakAuth.logoutUrl = this.keycloakAuth.authServerUrl + "/realms/beaba_dev/protocol/openid-connect/logout?redirect_uri=http://localhost:4200/index.html";
                    resolve();
                })
                .error(() => {
                    reject();
                });
        });

	} else {
            this.keycloakAuth.loggedIn = false;
            return new Promise((resolve, reject) => {resolve()});
        }
    }

    public logout() {
        if (this.runInBrowser) {
            this.keycloakAuth.logout();
        }
    }

    public isLogged(): boolean {
        if (this.runInBrowser) {
            if (!this.keycloakAuth) {
                return false;
            }
            return this.keycloakAuth.authenticated;
        } else {
            return false;
        }
    }

    public loadUserProfile(): Promise<any> {
        if (this.runInBrowser) {
            return new Promise((resolve, reject) => {
                this.keycloakAuth.loadUserProfile()
                        .success((profile) => {
                            resolve(profile);
                        })
                        .error((err) => {
                                reject(err);
                            });
            });
        } else {
            return new Promise((resolve, reject) => {reject('Running on server. No Keycloak available')});
        }
    }

    public isAdmin(): boolean {
        if (this.runInBrowser) {
            return this.keycloakAuth.hasRealmRole("admin") || this.keycloakAuth.hasRealmRole("super_admin");
        }
        return false;
    }

    public isSuperAdmin(): boolean {
        if (this.runInBrowser) {
            return this.keycloakAuth.hasRealmRole("super_admin");
        }
        return false;
    }

    public isParent(): boolean {
        if (this.runInBrowser) {
            return this.keycloakAuth.hasRealmRole("parent");
        }
        return false;
    }

    public isTranslator(): boolean {
        if (this.runInBrowser) {
            return this.keycloakAuth.hasRealmRole("translator") || this.keycloakAuth.hasRealmRole("super_translator");
        }
        return false;
    }

    public isSuperTranslator(): boolean {
        if (this.runInBrowser) {
            return this.keycloakAuth.hasRealmRole("super_translator");
        }
        return false;
    }

    public isModerator(): boolean {
        if (this.runInBrowser) {
            return this.keycloakAuth.hasRealmRole("moderator") || this.keycloakAuth.hasRealmRole("super_moderator");
        }
        return false;
    }

    public isSuperModerator(): boolean {
        if (this.runInBrowser) {
            return this.keycloakAuth.hasRealmRole("super_moderator");
        }
        return false;
    }

    public isBeaba(): boolean {
        if (this.runInBrowser) {
            return this.keycloakAuth.hasRealmRole("beaba");
        }
        return false;
    }

    public isSav(): boolean {
        if (this.runInBrowser) {
            return this.keycloakAuth.hasRealmRole("sav") || this.keycloakAuth.hasRealmRole("super_sav");
        }
        return false;
    }

    public isSuperSav(): boolean {
        if (this.runInBrowser) {
            return this.keycloakAuth.hasRealmRole("super_sav");
        }
        return false;
    }

    public login(options: Keycloak.KeycloakLoginOptions = {}): Promise<any> {
        if (this.runInBrowser) {
            return new Promise((resolve, reject) => {
                this.keycloakAuth.login(options)
                    .success(async () => {
                        await this.loadUserProfile();
                        resolve();
                    })
                    .error(error => {
                        reject('An error happened during the login.');
                    });
            });
        }
        return new Promise((resolve, reject) => {reject('Running on server. No Keycloak available')});
      }

    public getToken(): Promise<string> {
        if (this.runInBrowser) {
            return new Promise(async (resolve, reject) => {
                try {
                    await this.updateToken(10);
                    resolve(this.keycloakAuth.token);
                } catch (error) {
                    this.login();
                }
            });
        }
        return new Promise((resolve, reject) => {reject('Running on server. No Keycloak available')});
    }

    public updateToken(minValidity: number = 5): Promise<boolean> {
        if (this.runInBrowser) {
            return new Promise(async (resolve, reject) => {
                if (!this.keycloakAuth) {
                    reject(false);
                    return;
                }
                this.keycloakAuth
                .updateToken(minValidity)
                .success(refreshed => {
                    resolve(refreshed);
                })
                .error(error => {
                    reject('Failed to refresh the token, or the session is expired');
                });
            });
        }
    }

    public addTokenToHeader(headersArg?: HttpHeaders): Observable<HttpHeaders> {
        return Observable.create(async (observer: Observer<any>) => {
            let headers = headersArg;
            if (!headers) {
                headers = new HttpHeaders();
            }
            try {
              if (this.isLogged()) {
                const token: string = await this.getToken();
                headers = headers.set('Authorization', 'Bearer ' + token);
              }
              observer.next(headers);
              observer.complete();
            }
            catch (error) {
                observer.error(error);
            }
        });
    }

    public getBearerExcludedUrls(): string[] {
        return this.bearerExcludedUrls;
    }

}
