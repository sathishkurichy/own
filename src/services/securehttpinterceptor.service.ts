import 'rxjs/add/operator/do';

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';

 
 
@Injectable()
export class SecuredHttpInterceptor implements HttpInterceptor {
 
    private excludedUrlsRegex: RegExp[];
    private authService: AuthService = null;

    constructor(private injector: Injector) {
    }

    private loadExcludedUrlsRegex() {
        if (!this.authService) {
            this.authService = this.injector.get(AuthService);
        }
        const excludedUrls: string[] = this.authService.getBearerExcludedUrls();
        this.excludedUrlsRegex = excludedUrls.map(urlPattern => new RegExp(urlPattern, 'i')) || [];
    }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.authService) {
            this.authService = this.injector.get(AuthService);
        }
        return this.authService.addTokenToHeader(req.headers).mergeMap(headersWithBearer => {
            const kcReq = req.clone({ headers: headersWithBearer });
            return next.handle(kcReq);
        });
    }
}
