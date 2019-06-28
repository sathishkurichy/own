import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

 
@Injectable()
export class BaseAuthGuardService implements CanActivate, CanLoad {
 
    constructor(public router: Router, public keycloakService: AuthService) { }
 
    canActivate(): boolean {
        return this.canDoIt();
    }
 
    canLoad(): boolean {
        return this.canDoIt();
    }

    canActivateChild(): boolean {
        return this.canDoIt();
    }

    roleConditon(): boolean {
        return false;
    }

    canDoIt(): boolean {
        if (this.keycloakService.keycloakAuth.loggedIn && this.keycloakService.keycloakAuth.authenticated) {
            if (!this.roleConditon()) {
                return false;
            }
            return true;
        } 
        else {
            this.keycloakService.keycloakAuth.login();
            return false;
        }
    }
}