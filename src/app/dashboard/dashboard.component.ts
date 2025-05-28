import { Component, ElementRef, inject, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { User } from '../core/model/common.model';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Swiper from 'swiper';
import { Autoplay } from 'swiper/modules';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { YourMatchesComponent } from '../your-matches/your-matches.component';

let self: any;
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf, NgClass, NgFor],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('videoRef1') videoRef1!: any;
  @ViewChild('videoRef2') videoRef2!: any;
  @ViewChild('videoRef3') videoRef3!: any;
  @ViewChild('videoRef4') videoRef4!: any;
  @ViewChild('videoRef5') videoRef5!: any;
  @ViewChild('videoRef6') videoRef6!: any;
  @ViewChild('videoRef7') videoRef7!: any;
  @ViewChild('videoRef8') videoRef8!: any;
  @ViewChild('videoRef9') videoRef9!: any;
  @ViewChild('videoRef10') videoRef10!: any;
  @ViewChild('videoRef11') videoRef11!: any;
  @ViewChild('videoRef12') videoRef12!: any;
  authService = inject(AuthService);
  user: User | any = {};

  // Revenue & Client Data
  recurringRevenue: any = '$0';
  thisMonthRevenue: any = '$0';
  newClients: number = 0;
  totalClients: number = 0;

  // Internal Counters
  recurringRevenueCounter: number = 0;
  thisMonthRevenueCounter: number = 0;
  newClientsCounter: number = 0;
  totalClientsCounter: number = 0;

  //Analytics
  recurringRevenueChange: number = 0;
  totalRevenueChange: number = 0;
  newClientsChange: number = 0;
  totalClientsChange: number = 0;

  // Flags to track intervals
  isWithinTen1: boolean = false;
  isWithinTen2: boolean = false;

  // Interval Identifiers
  recurringRevenueStop: any;
  thisMonthRevenueStop: any;
  newClientsStop: any;
  totalClientsStop: any;

  // Update Query Template
  updateQuery = {
    userId: '',
    lastMonthRevenue: null,
    thisMonthRevnue: null,
    recurringRevenue: null,
    newClients: 0,
    clientsLastMonth: null,
    totalClients: null,
  };

  constructor(private HttpClient: HttpClient, public _viewContainerRef: ViewContainerRef, public _dialog: MatDialog) {
    self = this;
    this.authService.me().subscribe({
      next: (response: any) => {
        this.user = response.data;
  
        if (this.user) {
          this.startRevenueCounter();
          this.startClientsCounter();
          this.startMonthlyRevenueCounter();
          this.startTotalClientsCounter();

          //analytics
          this.calculateRecurringRevenueChange();
          this.calculateTotalRevenueChange();
          this.calculateNewClientsChange();
          this.calculateTotalClientsChange();
        }
  
        this.checkFirstOfMonthAndCalculate();
      }
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const video1 = this.videoRef1.nativeElement;
    video1.muted = true;
    video1.click();

    const video2 = this.videoRef2.nativeElement;
    video2.muted = true;
    video2.click();

    const video3 = this.videoRef3.nativeElement;
    video3.muted = true;
    video3.click();

    const video4 = this.videoRef4.nativeElement;
    video4.muted = true;
    video4.click();

    const video5 = this.videoRef5.nativeElement;
    video5.muted = true;
    video5.click();

    const video6 = this.videoRef6.nativeElement;
    video6.muted = true;
    video6.click();

    const video7 = this.videoRef7.nativeElement;
    video7.muted = true;
    video7.click();

    const video8 = this.videoRef8.nativeElement;
    video8.muted = true;
    video8.click();

    const video9 = this.videoRef9.nativeElement;
    video9.muted = true;
    video9.click();

    const video10 = this.videoRef10.nativeElement;
    video10.muted = true;
    video10.click();

    const video11 = this.videoRef11.nativeElement;
    video11.muted = true;
    video11.click();

    const video12 = this.videoRef12.nativeElement;
    video12.muted = true;
    video12.click();
}

  onOpen() {
    
  }

  openYourMatchesModal() {
      const config = new MatDialogConfig();
  
      const influencerList: Array<any> = [];
  
      config.autoFocus = false;
      config.hasBackdrop = true;
      config.disableClose = false;
      config.viewContainerRef = this._viewContainerRef;
      config.minWidth = '60vw';
      config.maxWidth = '60vw';
      config.minHeight = '90vh';
      config.maxHeight = '90vh';
      config.panelClass = 'custom-dialog-container';
      self.dialogRef = this._dialog.open(YourMatchesComponent, config);
      self.dialogRef.componentInstance.user = this.user;
      self.dialogRef.componentInstance.userId = this.user._id;
      self.dialogRef
        .afterClosed()
        .subscribe((result: any) => {
          self.dialogRef = null;
         
          if (result) {
            
          }
        });
    }

  fetchSubscriptionDetails() {
    if(this.user.stripeSessionId && !this.user.stripeSubscriptionId) {
      let baseURL: string = '';
      if(this.user.subscription.type === 'FREE') {
        //baseURL = "http://localhost:3000/api/subscribe-stripe/details";
        baseURL = "https://distros-8f63ee867795.herokuapp.com/api/subscribe-stripe/details";
      } else if(this.user.subscription.type === 'PRO') {
        baseURL = "http://localhost:3000/api/subscribe-stripe-pro/details";
        //baseURL = "https://distros-8f63ee867795.herokuapp.com/api/subscribe-stripe-pro/details";
      } else if(this.user.subscription.type === 'SCALE') {
        baseURL = "http://localhost:3000/api/subscribe-stripe-scale/details";
        //baseURL = "https://distros-8f63ee867795.herokuapp.com/api/subscribe-stripe-pro/details";
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

  calculateNewClientsChange() {
    if (this.user.lastMonthNewClients === 0) {
      this.newClientsChange = this.user.thisMonthNewClients > 0 ? 100 : 0; // Avoid division by zero
    } else {
      let change = ((this.user.thisMonthNewClients - this.user.lastMonthNewClients) / this.user.lastMonthNewClients) * 100;
      this.newClientsChange =  Math.round(change); // Round to the nearest whole number
    }
  }

  calculateTotalClientsChange() {
    if (this.user.lastMonthTotalClients === 0) {
      this.totalClientsChange = this.user.thisMonthTotalClients > 0 ? 100 : 0; // Avoid division by zero
    } else {
      let change = ((this.user.thisMonthTotalClients - this.user.lastMonthTotalClients) / this.user.lastMonthTotalClients) * 100;
      this.totalClientsChange =  Math.round(change); // Round to the nearest whole number
    }
  }

  calculateTotalRevenueChange() {
    if (this.user.lastMonthTotalRevenue === 0) {
      this.totalRevenueChange = this.user.thisMonthTotalRevenue > 0 ? 100 : 0; // Avoid division by zero
   } else {
      let change = ((this.user.thisMonthTotalRevenue - this.user.lastMonthTotalRevenue) / this.user.lastMonthTotalRevenue) * 100;
      this.totalRevenueChange =  Math.round(change); // Round to the nearest whole number
   }
  }

  calculateRecurringRevenueChange() {
    if (this.user.lastMonthRecurringRevenue === 0) {
       this.recurringRevenueChange = this.user.thisMonthRecurringRevenue > 0 ? 100 : 0; // Avoid division by zero
    } else {
      let change = ((this.user.thisMonthRecurringRevenue - this.user.lastMonthRecurringRevenue) / this.user.lastMonthRecurringRevenue) * 100;
      this.recurringRevenueChange =  Math.round(change); // Round to the nearest whole number
    }
  }

  startMonthlyRevenueCounter() {
    this.thisMonthRevenue = 0;
    this.thisMonthRevenueCounter = 0;
    this.thisMonthRevenueStop = setInterval(() => {
      this.isWithinTen2 = ((Number(this.user?.thisMonthTotalRevenue) - this.thisMonthRevenueCounter) <= 10) ? true : false;
      if(this.thisMonthRevenueCounter < Number(this.user?.thisMonthTotalRevenue)) {
        this.thisMonthRevenueCounter += this.isWithinTen2 ? 1 : 100;
        this.thisMonthRevenue = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(this.thisMonthRevenueCounter);
      } else {
        clearInterval(this.thisMonthRevenueStop);
      }
    }, 10);
  }

  startTotalClientsCounter() {
    this.totalClients = 0;
    this.totalClientsCounter = 0;
    this.totalClientsStop = setInterval(() => {
      if(this.totalClientsCounter < Number(this.user?.thisMonthTotalClients)) {
        this.totalClientsCounter++;
        this.totalClients = this.totalClientsCounter;
      } else {
        clearInterval(this.totalClientsStop);
      }
    }, 10);
  }

  startRevenueCounter() {
    this.recurringRevenueCounter = 0;
    this.recurringRevenueStop = setInterval(() => {
      const targetRevenue = Number(this.user?.thisMonthRecurringRevenue) || 0;
      this.isWithinTen1 = (targetRevenue - this.recurringRevenueCounter) <= 10;
      
      if (this.recurringRevenueCounter < targetRevenue) {
        this.recurringRevenueCounter += this.isWithinTen1 ? 1 : 100;
        this.recurringRevenue = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(this.recurringRevenueCounter);
      } else {
        clearInterval(this.recurringRevenueStop);
      }
    }, 10);
  }

  startClientsCounter() {
    this.newClientsCounter = 0;
    this.newClientsStop = setInterval(() => {
      const targetClients = Number(this.user?.thisMonthNewClients) || 0;
      
      if (this.newClientsCounter < targetClients) {
        this.newClientsCounter++;
        this.newClients = this.newClientsCounter;
      } else {
        clearInterval(this.newClientsStop);
      }
    }, 10);
  }

  checkFirstOfMonthAndCalculate(): void {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const lastMonth = currentMonth == 1 ? 12 : currentMonth - 1;
    
    if (today.getDate() === 1) {
      // If it's the first day of the month, calculate for last month and this month
      const currentMonth = today.getMonth() + 1;
      const lastMonth = currentMonth == 1 ? 12 : (currentMonth - 1);

      // Fetch or calculate totals for last month and this month
      this.calculateRevenueAndClients(lastMonth, currentMonth);
    } else {
      
    }
  }

  calculateRevenueAndClients(lastMonth: number, currentMonth: number): void {
    
  }

  convertNumbers() {
    this.recurringRevenue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(this.user?.thisMonthRecurringRevenue);
    this.thisMonthRevenue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(this.user?.thisMonthTotalRevenue);
  }

  openArticle1() {
    const url = 'https://www.hellomagazine.com/hfm/culture/511677/best-fitness-influencers-to-follow/';
    window.open(url, "_blank");
  }

  openArticle2() {
    const url = 'https://dropshipping.com/article/dropshipping-youtubers/';
    window.open(url, "_blank");
  }

  openArticle3() {
    const url = 'https://www.getaccept.com/blog/top-sales-influencers';
    window.open(url, "_blank");
  }
}
