import { NgClass, NgIf } from '@angular/common';
import { Component, inject, OnInit, ViewContainerRef } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { CheckoutScreenComponent } from '../checkout-screen/checkout-screen.component';
import { User } from '../core/model/common.model';
import { SubscriptionService } from './membership.component.service';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';

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
  authService = inject(AuthService);
  userId!: string;
  user!: User;
  stripeProductIds: Array<any> = [];
  query = {
    userId: ''
  }
  constructor(public _dialog: MatDialog, public _viewContainerRef: ViewContainerRef,
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
  
  subscribeToPro() {
    this.isOpeningPro = true;
    setTimeout(() => {
      //const baseURL: string = "http://localhost:3000/api/subscribe/pro";
      const baseURL: string = "https://distros-8f63ee867795.herokuapp.com/api/subscribe/pro";

      const plan = _.find(this.stripeProductIds, { plan: 'Pro' });
      this.HttpClient.post<{ sessionUrl: string }>(baseURL, { priceId: plan.stripePriceId })
      .subscribe(response => {
        console.log('response:', response)
        window.location.href = response.sessionUrl;
        this.isOpeningPro = false;
      });
    }, 250)
  }

  subscribeToScale() {
    this.isOpeningAdvanced = true;
    setTimeout(() => {
      //const baseURL: string = "http://localhost:3000/api/subscribe/scale";
      const baseURL: string = "https://distros-8f63ee867795.herokuapp.com/api/subscribe/scale";

      const plan = _.find(this.stripeProductIds, {plan: 'Scale'});
      this.HttpClient.post<{ sessionUrl: string }>(baseURL, { priceId: plan.stripePriceId })
      .subscribe(response => {
        console.log('response:', response)
        window.location.href = response.sessionUrl;
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
        this.user.subscription.type = 'SCALE';
        this.isUserSubscribed = response.data.subscription?.type !== 'FREE TRIAL';
        this.isLoading = false;
      }
    })
  }

  cancelPro() {

  }

  cancelScale() {

  }

  onClickMonthly() {
    this.isDisplayYearly = false;
  }

  onClickYearly() {
    this.isDisplayYearly = true;
  }

}
