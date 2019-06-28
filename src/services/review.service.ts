import { Injectable, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';

import { ApiService } from './api.service';
import { HttpService } from './http.service';

@Injectable()
export class ReviewService {

    private KEYCLOAK_ADMIN_USERNAME: string = "beaba-backend";
    private KEYCLOAK_ADMIN_PASSWORD: string = "Ruisseau02";
    private KEYCLOAK_ADMIN_CLIENT_ID: string = "beaba-mobile";

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

    public getAllComments(locale?: string): Promise<any> {

        return new Promise((resolve, reject) => {

            let api_endpoint = '/api/v1/recipes/reviews/all';
            if(locale){
                api_endpoint += '?locale='+locale;
            }
            this.apiService.get(api_endpoint, {}).toPromise()
                .then((res) => {
                    let result: any = res;
                    console.log(res);
                    if (result.success) {
                        let reviews = result.payload;
                        resolve(reviews);
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


    public deleteComment(recipeId: number, reviewId: number): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            resolve(true)
            this.apiService.delete('/api/v1/recipes/' + recipeId + '/reviews/' + reviewId, {}).toPromise()
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
