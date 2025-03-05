import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { User } from '../core/model/common.model';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
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

  constructor() {
    this.authService.me().subscribe({
      next: (response: any) => {
        this.user = response.data;
  
        if (this.user) {
          this.startRevenueCounter();
          this.startClientsCounter();
          this.startMonthlyRevenueCounter();
          this.startTotalClientsCounter();
        }
  
        this.checkFirstOfMonthAndCalculate();
      }
    });
  }

  ngOnInit() {
  }

  startMonthlyRevenueCounter() {
    this.thisMonthRevenue = 0;
    this.thisMonthRevenueCounter = 0;
    this.thisMonthRevenueStop = setInterval(() => {
      this.isWithinTen2 = ((Number(this.user?.thisMonthRevenue) - this.thisMonthRevenueCounter) <= 10) ? true : false;
      if(this.thisMonthRevenueCounter < Number(this.user.recurringRevenue)) {
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
      if(this.totalClientsCounter < Number(this.user.totalClients)) {
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
      const targetRevenue = Number(this.user?.recurringRevenue) || 0;
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
      const targetClients = Number(this.user?.newClients) || 0;
      
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
      console.log('user:', this.user);
    }
  }

  calculateRevenueAndClients(lastMonth: number, currentMonth: number): void {
    
  }

  convertNumbers() {
    this.recurringRevenue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(this.user?.recurringRevenue);
    this.thisMonthRevenue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(this.user?.thisMonthRevenue);
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
