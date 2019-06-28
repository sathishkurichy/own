import { Injectable } from '@angular/core';
//import { Network } from '@ionic-native/network';
//import { Platform } from 'ionic-angular';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class Connectivity {

    private onDevice: boolean;
    public connexionEvent: BehaviorSubject<boolean>;

    constructor() {
        this.connexionEvent = new BehaviorSubject<boolean>(this.isOnline())
        
    }

    isOnline(): boolean {
        return true;
    }

    isOffline(): boolean {
        return false;
    }

    watchOnline(): Observable<any> {
        return Observable.of(1);
    }

    watchOffline(): Observable<any> {
        return Observable.of(1);
    }

}