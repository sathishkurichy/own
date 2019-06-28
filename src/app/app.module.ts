import {HTTP_INTERCEPTORS, HttpClient, HttpClientJsonpModule, HttpClientModule} from '@angular/common/http';
import { APP_INITIALIZER, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ApiCore } from '../domains/SharedKernel/core/api/apicore';
import { AdminAuthGuardService } from '../guards/admin.auth.guard';
import { BaseAuthGuardService } from '../guards/base.auth.guard';
import { ParentAuthGuardService } from '../guards/parent.auth.guard';
import { TranslatorAuthGuardService } from '../guards/translator.auth.guard';
import { AlertService } from '../services/alert.service';
import { HttpService } from '../services/http.service';
import { Api } from './../domains/SharedKernel/core/api/api';
import { ApiService } from './../services/api.service';
import { AuthService } from './../services/auth.service';
import { CSVService } from './../services/csv.service';
import { SecuredHttpInterceptor } from './../services/securehttpinterceptor.service';
import { UserService } from './../services/user.service';
import { initializer } from './app-init';
import { MainRoutingModule, routedComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShareButtonsModule } from '@ngx-share/buttons';
import {ErrorService} from '../services/error.service';
import { LanguageService } from '../domains/SharedKernel/services/lang/language.service';
import {ReviewService} from '../services/review.service';
import { StorageServiceModule } from 'angular-webstorage-service';
import { SavAuthGuardService } from '../guards/sav.auth.guard';
import { ModeratorAuthGuardService } from '../guards/moderator.auth.guard';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [
        AppComponent,
        routedComponents,
    ],
    imports: [
        NgxDatatableModule,
        BrowserModule.withServerTransition({appId: 'beaba-app'}),
        StorageServiceModule,
        HttpModule,
        HttpClientModule,
        HttpClientJsonpModule,
        MainRoutingModule,
        ShareButtonsModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
        }),
        FontAwesomeModule
    ],
    providers: [
        AuthService,
        {
            provide: APP_INITIALIZER,
            useFactory: initializer,
            multi: true,
            deps: [AuthService]
        },
        UserService,
        ReviewService,
        ApiCore,
        CSVService,
        ApiService,
        HttpService,
        Api,
        AlertService,
        ErrorService,
        BaseAuthGuardService,
        ParentAuthGuardService,
        TranslatorAuthGuardService,
        ModeratorAuthGuardService,
        AdminAuthGuardService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: SecuredHttpInterceptor,
            multi: true
        },
        SavAuthGuardService,
        LanguageService,
    ],
    bootstrap: [AppComponent],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }

