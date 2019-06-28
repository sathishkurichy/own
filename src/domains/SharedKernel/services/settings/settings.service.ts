import { Injectable } from '@angular/core';

@Injectable()
export class Settings {

    private settings: any;
    private _defaults: any;

    constructor(storage: any, defaults: any) {
        this._defaults = defaults;
    }

    get allSettings() {
        return this.settings;
    }
}