import { NgClass, NgIf } from '@angular/common';
import { Component, inject, OnInit, ViewContainerRef } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { CheckoutScreenComponent } from '../checkout-screen/checkout-screen.component';
import { User } from '../core/model/common.model';

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
  currentPlan: string = 'Free Trial';
  authService = inject(AuthService);
  userId!: string;
  user!: User;
  query = {
    userId: ''
  }
  constructor(public _dialog: MatDialog, public _viewContainerRef: ViewContainerRef) {
    self = this;
  }

  ngOnInit() {
    this.me();
  }

  me() {
    this.authService.me().subscribe({
      next: (response: any) => {
        this.user = response.data;
        this.userId = response.data._id;
        this.query.userId = response.data._id;
        this.isUserSubscribed = response.data.subscription?.type !== 'FREE TRIAL';
        this.isLoading = false;
      }
    })
  }

  onClickMonthly() {
    this.isDisplayYearly = false;
  }

  onClickYearly() {
    this.isDisplayYearly = true;
  }

  openMembershipModal(membershipPlan: string) {
    if(membershipPlan === 'Starter') {
      console.log('1')
      this.isOpeningStarter = true;
      this.isOpeningPro = false;
      this.isOpeningAdvanced = false;
    } else if(membershipPlan === 'Pro') {
      console.log('2')
      this.isOpeningStarter = false;
      this.isOpeningPro = true;
      this.isOpeningAdvanced = false;
    } else if(membershipPlan === 'Advanced') {
      console.log('3')
      this.isOpeningStarter = false;
      this.isOpeningPro = false;
      this.isOpeningAdvanced = true;
    }

    this.isLoading = true;
    this.isLoading = false;
    const config = new MatDialogConfig();
    
        config.autoFocus = false;
        config.disableClose = false;
        config.viewContainerRef = this._viewContainerRef;
        config.hasBackdrop = true;
        config.disableClose = true
        config.minWidth = '75vw';
        config.maxWidth = '75vw';
        config.minHeight = '75vh';
        config.maxHeight = '75vh';
        self.dialogRef = this._dialog.open(CheckoutScreenComponent, config);
        self.dialogRef.componentInstance.data = [];
        self.dialogRef
          .afterClosed()
          .subscribe((result: any) => {
            self.dialogRef = null;
            if (result) {
              
            }
            this.isOpeningStarter = false;
            this.isOpeningPro = false;
            this.isOpeningAdvanced = false;
          });
  }
}
