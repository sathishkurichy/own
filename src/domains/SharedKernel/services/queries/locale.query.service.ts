import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Api } from '../../core/api/api';
import { LocaleInDto } from '../../model/localeInDto.model';
import { Connectivity } from '../connectivity/connectivity.service';


@Injectable()
export class LocaleQueryService {

    constructor(public api: Api,
                public connectivity: Connectivity) { }

    getLocales(): Observable<Array<LocaleInDto>> {

        const locales$: Subject<Array<LocaleInDto>> = new Subject<Array<LocaleInDto>>();

        if (this.connectivity.isOffline()) {
            locales$.error({
                isError: true,
                reqData: {},
                respData: 'error offline'
            });
        }
        else {
            this.api.get('/api/v1/cultures/all', {})
            .subscribe((res) => {
                let result = res.json();
                if (result.success) {
                    let arrayOfLocales = result.payload.results.map((value) => {
                        return {
                            name: value.name,
                            locale: value.locale
                        }
                    });

                    locales$.next(arrayOfLocales);
                }
                else {
                    locales$.error({
                        isError: true,
                        reqData: {},
                        respData: 'error offline'
                    });
                }
            },
            (err) => {
                locales$.error({
                    isError: true,
                    reqData: {},
                    respData: 'error offline'
                });
            });

            }

        return locales$.asObservable();
    }
}
