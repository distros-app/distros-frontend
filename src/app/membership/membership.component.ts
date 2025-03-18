import { NgClass, NgIf } from '@angular/common';
import { Component, inject, OnInit, ViewContainerRef } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { CheckoutScreenComponent } from '../checkout-screen/checkout-screen.component';
import { User } from '../core/model/common.model';
import { SubscriptionService } from './membership.component.service';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { CancelMembershipConfirmationComponent } from '../cancel-membership-confirmation/cancel-membership-confirmation.component';
import { catchError, throwError } from 'rxjs';

let self: any;
@Component({
  selector: 'app-membership',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.scss']
})
export class MembershipComponent implements OnInit {
  dialog!: MatDialogRef<any>;
  isUserSubscribed!: boolean;
  isLoading: boolean = true;
  isOpeningStarter: boolean = false;
  isOpeningPro: boolean = false;
  isOpeningAdvanced: boolean = false;
  isDisplayYearly: boolean = false;
  isCancelingPro: boolean = false;
  isCancelingAdvanced: boolean = false;
  currentPlan: string = '';
  mySubscriptionId: string = '';
  authService = inject(AuthService);
  toastrService = inject(ToastrService);
  userId!: string;
  user!: User;
  stripeProductIds: Array<any> = [];
  query = {
    userId: ''
  }
  constructor(public _dialog: MatDialog, public _viewContainerRef: ViewContainerRef, private _toastr: ToastrService,
              private HttpClient: HttpClient, private SubscriptionService: SubscriptionService) {
    self = this;
  }

  ngOnInit() {
    this.me();
    this.fetchProductIds();
  }

  fetchProductIds() {
    this.SubscriptionService.fetchAllProductIds({}).subscribe({
      next: (response: any) => {
        this.stripeProductIds = response.data;
      }
    })
  }

  fetchSubscriptionDetails() {
    if(this.user.stripeSessionId && !this.user.stripeSubscriptionId) {
      let baseURL: string = '';

      if(this.user.subscription.type === 'PRO') {
        //baseURL = "http://localhost:3000/api/subscribe-stripe-pro/details";
        baseURL = "https://distros-8f63ee867795.herokuapp.com/api/subscribe-stripe-pro/details";
      } else if(this.user.subscription.type === 'SCALE') {
        //baseURL = "http://localhost:3000/api/subscribe-stripe-scale/details";
        baseURL = "https://distros-8f63ee867795.herokuapp.com/api/subscribe-stripe-pro/details";
      }

      this.HttpClient.post<{ status: string }>(baseURL, { sessionId: this.user.stripeSessionId, user: this.user })
        .subscribe(response => {
          if(response) {
            const subscriptionStatus = response.status;
            if(subscriptionStatus != 'active') {
              //reset status to FREE Plant
            }
          }
        });
    }
  }
  
  subscribeToPro() {
    this.isOpeningPro = true;
    setTimeout(() => {
      //const baseURL: string = "http://localhost:3000/api/subscribe-stripe-pro";
      const baseURL: string = "https://distros-8f63ee867795.herokuapp.com/api/subscribe-stripe-pro";

      const plan = _.find(this.stripeProductIds, { plan: 'Pro' });
      //const plan = _.find(this.stripeProductIds, { plan: 'Testing' });
      this.HttpClient.post<{ session: any }>(baseURL, { priceId: plan.stripePriceId, userId: this.userId })
      .subscribe(response => {
        window.location.href = response.session.url;
        //toastr success message
        this.isOpeningPro = false;
      });
    }, 250)
  }

  subscribeToScale() {
    this.isOpeningAdvanced = true;
    setTimeout(() => {
      //const baseURL: string = "http://localhost:3000/api/subscribe-stripe-scale";
      const baseURL: string = "https://distros-8f63ee867795.herokuapp.com/api/subscribe-stripe-scale";

      const plan = _.find(this.stripeProductIds, { plan: 'Scale' });
      //const plan = _.find(this.stripeProductIds, {plan: 'Testing'});
      this.HttpClient.post<{ session: any }>(baseURL, { priceId: plan.stripePriceId, userId: this.userId })
      .subscribe(response => {
        window.location.href = response.session.url;
        this.isOpeningAdvanced = false;
      });
    }, 250);
  }

  me() {
    this.authService.me().subscribe({
      next: (response: any) => {
        this.user = response.data;
        this.userId = response.data._id;
        this.query.userId = response.data._id;
        this.currentPlan = `${response.data.subscription?.type.charAt(0).toUpperCase()}${response.data.subscription?.type.slice(1).toLowerCase()}`;
        //this.isUserSubscribed = response.data.subscription?.type !== 'FREE TRIAL';
        this.isLoading = false;
      }
    })
  }

  cancelPro() {
    const config = new MatDialogConfig();
          
    config.autoFocus = false;
    config.disableClose = false;
    config.viewContainerRef = this._viewContainerRef;
    config.hasBackdrop = true;
    config.minWidth = '40vw';
    config.maxWidth = '40vw';
    config.minHeight = '30vh';
    config.maxHeight = '30vh';
    config.panelClass = 'custom-dialog-container';
      self.dialogRef = this._dialog.open(CancelMembershipConfirmationComponent, config);
      self.dialogRef.componentInstance.userId = this.userId;
      self.dialogRef
        .afterClosed()
        .subscribe((response: any) => {
          self.dialogRef = null;
          if (response) {
            this.isCancelingPro = true;
            //const baseURL: string = "http://localhost:3000/api/subscribe-stripe-pro/cancel";
            const baseURL: string = "https://distros-8f63ee867795.herokuapp.com/api/subscribe-stripe-pro/cancel";

            this.HttpClient.post<{ session: any }>(baseURL, { subscriptionId: this.user.stripeSubscriptionId, userId: this.userId })
            .pipe(
              catchError(error => {
                this.isCancelingPro = false;
                this._toastr.success('Failed to cancel your membership. Please contact support.', 'Error', {
                  toastClass: 'custom-toast',
                });
                return throwError(() => error); // Rethrow the error if needed
              })
            ).subscribe(response => {
                if(response) {
                  this.isCancelingPro = false;
                  this.me();
                  this._toastr.success('Your membership was successfully canceled!', 'Success', {
                    toastClass: 'custom-toast', // Add a custom class
                  });
                }
              });
            }
        });
  }

  cancelScale() {
    const config = new MatDialogConfig();
          
    config.autoFocus = false;
    config.disableClose = false;
    config.viewContainerRef = this._viewContainerRef;
    config.hasBackdrop = true;
    config.minWidth = '40vw';
    config.maxWidth = '40vw';
    config.minHeight = '30vh';
    config.maxHeight = '30vh';
    config.panelClass = 'custom-dialog-container';
      self.dialogRef = this._dialog.open(CancelMembershipConfirmationComponent, config);
      self.dialogRef.componentInstance.userId = this.userId;
      self.dialogRef
        .afterClosed()
        .subscribe((response: any) => {
          self.dialogRef = null;
          if (response) {
            this.isCancelingAdvanced = true;
            //const baseURL: string = "http://localhost:3000/api/subscribe-stripe-scale/cancel";
            const baseURL: string = "https://distros-8f63ee867795.herokuapp.com/api/subscribe-stripe-scale/cancel";

            this.HttpClient.post<{ session: any }>(baseURL, { subscriptionId: this.user.stripeSubscriptionId, userId: this.userId })
            .pipe(
              catchError(error => {
                this.isCancelingAdvanced = false;
                this._toastr.success('Failed to cancel your membership. Please contact support.', 'Error', {
                  toastClass: 'custom-toast',
                });
                return throwError(() => error); // Rethrow the error if needed
              })
            ).subscribe(response => {
              if(response) {
                this.isCancelingAdvanced = false
                this.me();
                this._toastr.success('Your membership was successfully canceled!', 'Success', {
                  toastClass: 'custom-toast', // Add a custom class
                });
              }
            });
          }
        });
  }

  onClickMonthly() {
    this.isDisplayYearly = false;
  }

  onClickYearly() {
    this.isDisplayYearly = true;
  }

}
