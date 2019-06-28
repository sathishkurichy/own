import { Component, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { AlertService } from '../../services/alert.service';
import { UserService } from './../../services/user.service';
import * as moment from 'moment';
import { faEye, faEdit } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'page-sav',
    templateUrl: 'sav.html',
    styleUrls: ['sav.scss']
})

export class SavPage {

    @ViewChild('myTable') table: any;
    @ViewChild('detailTemplate') detailTemplate: any;

    sav: Array<any> = [];
    columns = [];
    faEye = faEye;
    faEdit = faEdit;
    alreadySelected: boolean = false;
    modeExpand: string;

    constructor(private userService: UserService,
                private alertService: AlertService,
                public authService: AuthService,
                private ngZone: NgZone,
                private translate: TranslateService,
                ) {

    }

    ngOnInit(): void {

        let idTitle                 = "#";
        let idCustomer              = "WEBSITE.USERS.TITLE_ID_CLIENT"
        let emailTitle              = "WEBSITE.USERS.TITLE_EMAIL";
        let boughtDateTitle         = "WEBSITE.USERS.TITLE_BOUGHT_DATE";
        let productTitle            = "WEBSITE.USERS.TITLE_PRODUCT";
        let productSerialNumber     = "WEBSITE.USERS.PRODUCT_SERIALNUMBER";
        let shopTitle               = "WEBSITE.USERS.TITLE_SHOP";
        let statusTitle             = "WEBSITE.USERS.TITLE_STATUS";
        let createdDateTitle        = "WEBSITE.USERS.TITLE_CREATED_DATE";
        let modifiedDateTitle       = "WEBSITE.USERS.TITLE_MODIFIED_DATE"

        this.translate.get([idTitle, idCustomer, emailTitle, boughtDateTitle, productSerialNumber, productTitle, shopTitle, statusTitle, 
                            createdDateTitle, modifiedDateTitle]).subscribe((res) => {
            //    { name:  res[idCustomer], prop: 'customer' },
            this.columns = [
                { name:  res[idTitle], prop: 'id' },
                { name:  res[emailTitle], prop: 'user_email' },
                { name:  res[productSerialNumber], prop: 'serialNumber' },
                { name:  res[boughtDateTitle], prop: 'purchaseDate' },
                { name:  res[productTitle], prop: 'name' },
                { name:  res[shopTitle], prop: 'shop' },
                { name:  res[statusTitle], prop: 'status' },
                { name:  res[createdDateTitle], prop: 'createDate' },
                { name:  res[modifiedDateTitle], prop: 'updateDate' },
                { name:  "Actions", sortable: false, cellTemplate: this.detailTemplate },
            ];
        });

        this.userService.getAllProducts().then((listProducts) => {
            this.ngZone.run(() => {
                listProducts.forEach((product) => {
                    product.purchaseDate = moment(product.purchaseDate).format("YYYY-MM-DD");
                    let firstName = product.user_firstname != null ? product.user_firstname : "";
                    let lastName = product.user_lastname != null ? product.user_lastname : "";
                    product.customer =  firstName + " " + lastName;
                });
                console.log("listProducts", listProducts);
                this.sav = listProducts;
            });
        })
        .catch((err) => {
            this.alertService.showMessage("Béaba", "ERROR_MESSAGE.DEFAULT");
        });
    }

    openDetailProduct(row: any, index: any) {
        this.modeExpand = "details";

        this.table.rowDetail.collapseAllRows();
        this.table.rowDetail.toggleExpandRow(row);
    }

    editDetailProduct(row: any, index: any) {
        this.modeExpand = "edit";

        this.table.rowDetail.collapseAllRows();
        this.table.rowDetail.toggleExpandRow(row);
    }
    openImage(row: any) {
        console.log("row.purchaseTicket", row.purchaseTicket);
        console.log("row", row);
        window.open(row.purchaseTicket, '_blank');
    }


    onLocaleChange(locale: string): void{
        this.userService.getAllProducts(locale).then((listProducts) => {
            this.ngZone.run(() => {
                listProducts.forEach((product) => {
                    product.purchaseDate = moment(product.purchaseDate).format("YYYY-MM-DD");
                    let firstName = product.user_firstname != null ? product.user_firstname : "";
                    let lastName = product.user_lastname != null ? product.user_lastname : "";
                    product.customer =  firstName + " " + lastName;
                });
                console.log("listProducts", listProducts);
                this.sav = listProducts;
            });
        })
        .catch((err) => {
            this.alertService.showMessage("Béaba", "ERROR_MESSAGE.DEFAULT");
        });
    }
}