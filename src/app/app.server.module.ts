import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Observable } from "rxjs/Observable";
import { Observer } from 'rxjs/Observer';
import { readFileSync } from 'fs';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';


export class TranslateUniversalLoader implements TranslateLoader {

    public getTranslation(lang: string): Observable<any> {
      const langPath = `./dist/assets/i18n/${lang}.json`;
      return Observable.create( (observer: Observer<any>)  => {
          observer.next(JSON.parse(readFileSync(langPath, 'utf8')));
          observer.complete();
      });
    }
}

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateUniversalLoader
      }
  })
  ],
  declarations: [],
  exports: [],
  providers: [],
  id: 'AppServerModule',
  bootstrap: [ AppComponent ]
})
export class AppServerModule { }


