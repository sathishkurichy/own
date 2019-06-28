import { ModuleWithProviders, NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { SharedKernelModule } from '../module/shared-kernel.module';
import { spinnerProjection } from './projection/spinner.projection';

@NgModule({
    imports: [
        SharedKernelModule,
        StoreModule.forFeature('showSpinnerState', spinnerProjection),
        TranslateModule.forChild()
    ],
    declarations: [],
    exports: [],
    providers: []
})

export class SpinnerManagementModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SpinnerManagementModule,
            providers: [],
        };
    }
}