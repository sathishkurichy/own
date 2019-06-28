import { Component, NgZone, ViewChild } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { AlertService } from '../../services/alert.service';
import { AuthService } from './../../services/auth.service';
import { CSVService } from './../../services/csv.service';
import { ReviewService } from './../../services/review.service';
import * as moment from 'moment';
import {faSpinner, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../services/user.service';
import { LocaleInDto } from '../../domains/SharedKernel/model/localeInDto.model';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'page-reviews-management',
    templateUrl: 'reviews-management.html',
    styleUrls: ['reviews-management.scss']
})
export class ReviewsManagementPage {

    @ViewChild('myTable') table: any;
    @ViewChild('detailTemplate') detailTemplate: any;

    isOpen: boolean = false;

    reviews: Array<any> = [];
    columns = [];


    loading: boolean = false;
    loadingReviews: boolean = false;
    
    errorLoadingKReview: boolean = false;

  faTimesCircle = faTimesCircle;
  faSpinner = faSpinner;

    constructor(private router: Router,
                private reviewService: ReviewService,
                private csvService: CSVService,
                private alertService: AlertService,
                private translate: TranslateService,
                private ngZone: NgZone,
                public authService: AuthService
                ) {
    }

    ngOnInit(): void {

        let idRecipe            = "WEBSITE.REVIEWS_MANAGEMENT.RECIPE_ID";
        let nameRecipe          = "WEBSITE.REVIEWS_MANAGEMENT.RECIPE_NAME";
        let emailUser           = "WEBSITE.REVIEWS_MANAGEMENT.USER_EMAIL";
        let username           = "WEBSITE.REVIEWS_MANAGEMENT.USERNAME";
        let commentReview       = "WEBSITE.REVIEWS_MANAGEMENT.REVIEW_COMMENT";
        let creationDateReview  = "WEBSITE.REVIEWS_MANAGEMENT.REVIEW_CREATION_DATE";
        let DeleteReview  = "'WEBSITE.REVIEWS_MANAGEMENT.DELETE_COMMENT'";

        this.translate.get([idRecipe, nameRecipe, emailUser, username, commentReview,
            creationDateReview]).subscribe((res) => {
            this.columns = [
                { name:  res[idRecipe], prop: 'recipeId' },
                { name:  res[nameRecipe], prop: 'recipeName' },
                { name:  res[emailUser], prop: 'userEmail' },
                { name:  res[username], prop: 'username' },
                { name:  res[commentReview], prop: 'reviewComment' },
                { name:  res[creationDateReview], prop: 'creationDate' },
                { name:  "Actions", sortable: false, cellTemplate: this.detailTemplate, width: '250' }
            ];
        });

        this.loadingReviews = true;
        this.reviewService.getAllComments()
        .then((res) => {
            this.ngZone.run(() => {
                console.log(res);
                res.results.forEach((review) => {
                    review.creationDate = moment(review.creationDate).format("YYYY-MM-DD");
                });
                this.loadingReviews = false;
                console.log("REVIEW ",res.results);
                this.reviews = res.results;
            });
        })
        .catch((err) => {
            this.ngZone.run(() => {
                this.loadingReviews = false;
            });
            this.alertService.showMessage("Béaba", "ERROR_MESSAGE.DEFAULT");
        });
    }

    setLoading(value: boolean): void {
      this.loading = value;
    }

    exportToCSVClick(): void {
        let stringReviews = JSON.stringify(this.reviews);
        let csv = this.csvService.parseToCSV(stringReviews);
        this.csvService.saveFile(csv);
    }

    deleteComment(row): void {
        const recipeId = row.recipeId;
        const reviewId = row.reviewId;

        console.log(row);
        this.setLoading(true);
        this.reviewService.deleteComment(recipeId,reviewId)
        .then((res) => {
          this.ngZone.run(() => {
            let index = this.reviews.findIndex(review => review.reviewId === reviewId);
            this.reviews.splice(index, 1);
            this.table.rows = this.reviews;

              this.setLoading(false);
              this.errorLoadingKReview = false;
          });
        })
        .catch((err) => {
          this.ngZone.run(() => {
              this.setLoading(false);
              this.errorLoadingKReview = true;
          });
        });
    }

    seeComment(row): void {
        this.table.rowDetail.collapseAllRows();
        this.table.rowDetail.toggleExpandRow(row);
    }


    

    onLocaleChange(locale: string): void{
    this.loadingReviews = true;
    this.reviewService.getAllComments(locale)
        .then((res) => {
            this.ngZone.run(() => {
                console.log(res);
                res.results.forEach((review) => {
                    review.creationDate = moment(review.creationDate).format("YYYY-MM-DD");
                });
                this.loadingReviews = false;
                console.log("REVIEW ",res.results);
                this.reviews = res.results;
            });
        })
        .catch((err) => {
            this.ngZone.run(() => {
                this.loadingReviews = false;
            });
            this.alertService.showMessage("Béaba", "ERROR_MESSAGE.DEFAULT");
        });
    }
}
