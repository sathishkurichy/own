import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/defaultIfEmpty';
import 'rxjs/add/observable/defer';
import { AuthService } from './services/auth.service';

if (environment.production) {
  enableProdMode();
}

//const platform = platformBrowserDynamic();
//platform.bootstrapModule(AppModule).catch(err => console.error('bootstrapModule ERROR', err));
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error("bootstrapModule ERR", err));
