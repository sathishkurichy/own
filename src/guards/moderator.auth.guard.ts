import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, CanLoad } from '@angular/router';
import { BaseAuthGuardService } from './base.auth.guard';

@Injectable()
export class ModeratorAuthGuardService extends BaseAuthGuardService {
 
    constructor(public router: Router, public keycloakService: AuthService) {
        super(router, keycloakService);
    }
 
    roleConditon(): boolean {
        return this.keycloakService.isModerator() || this.keycloakService.isSuperModerator();
    }
}