import { Component, NgZone, ViewChild } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { AlertService } from '../../services/alert.service';
import { AuthService } from './../../services/auth.service';
import { CSVService } from './../../services/csv.service';
import { UserService } from './../../services/user.service';
import * as moment from 'moment';
import {faSpinner, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import {FormControl, Validators} from '@angular/forms';
import {forEach} from '@angular/router/src/utils/collection';

@Component({
    selector: 'page-users',
    templateUrl: 'users.html',
    styleUrls: ['users.scss']
})
export class UsersPage {

    @ViewChild('myTable') table: any;
    @ViewChild('detailTemplate') detailTemplate: any;

    isOpen: boolean = false;

    users: Array<any> = [];
    columns = [];

    currentUserEnable: boolean = false;
    currentUserIsAnonyme: boolean = false;

    loading: boolean = false;
    loadingUsers: boolean = false;

    errorLoadingKUser: boolean = false;

  faTimesCircle = faTimesCircle;
  faSpinner = faSpinner;

    isParentReferentFormControl: FormControl;

    constructor(private router: Router,
                private userService: UserService,
                private csvService: CSVService,
                private alertService: AlertService,
                private translate: TranslateService,
                private ngZone: NgZone,
                private authService: AuthService,
                ) {
        this.isParentReferentFormControl = new FormControl(null, [Validators.required])
    }

    ngOnInit(): void {

        let idTitle                 = "WEBSITE.USERS.TITLE_ID";
        let firstnameTitle          = "WEBSITE.USERS.TITLE_FIRSTNAME";
        let lastnameTitle           = "WEBSITE.USERS.TITLE_LASTNAME";
        let emailTitle              = "WEBSITE.USERS.TITLE_EMAIL";
        let nbChildrenTitle         = "WEBSITE.USERS.TITLE_NB_CHILDREN";
        let nbFavRecipesTitle       = "WEBSITE.USERS.TITLE_NB_FAV_RECIPE";
        let nbCreatedRecipeTitle    = "WEBSITE.USERS.TITLE_NB_CREATED_RECIPE";
        let nbProductTitle          = "WEBSITE.USERS.TITLE_NB_PRODUCTS";
        let createdDateTitle        = "WEBSITE.USERS.TITLE_CREATED_DATE";
        let nbOfCommentsTitle       = "WEBSITE.USERS.TITLE_NUMBER_COMMENTS";

        this.translate.get([idTitle, firstnameTitle, lastnameTitle, emailTitle,
            nbChildrenTitle, nbFavRecipesTitle, nbCreatedRecipeTitle, nbProductTitle, createdDateTitle, nbOfCommentsTitle]).subscribe((res) => {
            this.columns = [
                { name:  res[idTitle], prop: 'id' },
                { name:  res[createdDateTitle], prop: 'createdDate' },
                { name:  res[firstnameTitle], prop: 'firstname' },
                { name:  res[lastnameTitle], prop: 'lastname' },
                { name:  res[emailTitle], prop: 'email' },
                { name:  res[nbChildrenTitle], prop: 'nbChildren' },
                { name:  res[nbFavRecipesTitle], prop: 'nbFavoriteRecipes' },
                { name:  res[nbCreatedRecipeTitle], prop: 'nbCreatedRecipes' },
                { name:  res[nbProductTitle], prop: 'nbProducts' },
                { name:  res[nbOfCommentsTitle], prop: 'nbComments' },
                { name:  "Keycloak Id", prop: 'keycloakId' },
                { name:  "Actions", sortable: false, cellTemplate: this.detailTemplate },
            ];
        });

        this.loadingUsers = true;
        this.userService.getAllUser()
        .then((res) => {
            this.ngZone.run(() => {

                res.forEach((user) => {
                    user.createdDate = moment(user.createdDate).format("YYYY-MM-DD");
                });
                this.loadingUsers = false;
                console.log("USERS ",res);
                this.users = res;
            });
        })
        .catch((err) => {
            this.ngZone.run(() => {
                this.loadingUsers = false;
            });
            this.alertService.showMessage("Béaba", "ERROR_MESSAGE.DEFAULT");
        });

    }

    setLoading(value: boolean): void {
      this.loading = value;
    }

    exportToCSVClick(): void {
        let stringUsers = JSON.stringify(this.users);
        let csv = this.csvService.parseToCSV(stringUsers);
        this.csvService.saveFile(csv);
    }

    toggleExpandRow(row, index): void {

            this.userService.getRoles(row.keycloakId).then(  (data) => {
                let isParentReferent = false;
                let roles = data.payload; 
                roles.forEach(role => {
                    console.log(role.name);
                    if (role.name == "parent_referent") {
                        isParentReferent = true;
                    }
                });
                this.ngZone.run(() => {
                    this.isParentReferentFormControl.setValue(isParentReferent);
                });
            });



        const rowHeight = 50;
        const offset = index * rowHeight;

        this.setLoading(true);
        this.userService.getKeycloakUser(row.keycloakId)
        .then((data) => {
            this.ngZone.run(() => {
                let res = data.payload;
                this.setLoading(false);
                this.errorLoadingKUser = false;
                this.currentUserEnable = res.enabled;
                this.currentUserIsAnonyme = row.isAnonym;
            });
        })
        .catch((err) => {
            this.ngZone.run(() => {
                this.setLoading(false);
                this.errorLoadingKUser = true;
                this.currentUserEnable = false;
                this.currentUserIsAnonyme = false;
                console.error('GET KEYCLOAK USER ERROR', err);
            });
        });

        this.table.rowDetail.collapseAllRows();
        this.table.rowDetail.toggleExpandRow(row);

        this.table.element.getElementsByTagName('datatable-body')[0].scrollTop = offset;

    }

    toggleUserState(row): void {
        this.userService.updateKeycloakUserState(row.keycloakId, !this.currentUserEnable)
        .then((res) => {
            this.ngZone.run(() => {
                row.enable = !row.enable;
                this.currentUserEnable = !this.currentUserEnable;
                this.errorLoadingKUser = false;
            });
        })
        .catch((err) => {
            this.ngZone.run(() => {
                this.errorLoadingKUser = true;
            });
        });
    }

    anonymizeUser(row): void {
        const userId = row.id;
        this.setLoading(true);
        this.userService.disableUser(userId)
        .then((res) => {
          this.ngZone.run(() => {
              row.isAnonym = true;
              this.setLoading(false);
              this.currentUserIsAnonyme = true;
              this.errorLoadingKUser = false;
          });
        })
        .catch((err) => {
          this.ngZone.run(() => {
              this.setLoading(false);
              this.errorLoadingKUser = true;
          });
        });
    }


    addOrRemoveRoleParentReferent(row): void{
        console.log(row.keycloakId);
        if(!this.isParentReferentFormControl.value) {
            this.userService.addParentReferentRole(row.keycloakId);
        }else{
            this.userService.removeParentReferentRole(row.keycloakId);
        }

    }

}
