import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './../services/auth.service';
import { BaseAuthGuardService } from './base.auth.guard';

 
@Injectable()
export class SavAuthGuardService extends BaseAuthGuardService {
 
    constructor(public router: Router, public keycloakService: AuthService) {
        super(router, keycloakService);
    }
 
    roleConditon(): boolean {
        return this.keycloakService.isSav();
    }
}