import { Component, ElementRef, inject, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FindInfluencersService } from '../find-influencers/find-influencers.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { AuthService } from '../core/services/auth.service';
import { User } from '../core/model/common.model';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { CreateNewListComponent } from '../create-new-list/create-new-list.component';
import { CreateListService } from '../create-new-list/create-new-list.service';
import { DeleteListComponent } from '../delete-list/delete-list.component';
import { RemoveInfluencerComponent } from '../delete-influencer/remove-influencer.component';
import { CreateNewCampaignComponent } from '../create-new-campaign/create-new-campaign.component';
import { DeleteCampaignComponent } from '../delete-campaign/delete-campaign.component';
import { CampaignsService } from './campaigns.service';
import { ActionsService } from '../actions/actions.service';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';

let self: any;
@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, CommonModule],
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss']
})

export class CampaignsComponent implements OnInit {
  authService = inject(AuthService);
  userId!: string;
  isLoading: boolean = false;
  isPageLoading: boolean = true;
  hasMoreData: boolean = true;
  isListSelected: boolean = false;
  isMoreLoading: boolean = false;
  campaignsExist!: boolean;
  campaigns: Array<any> = [];
  campaignStatuses: Array<any> = [{name: 'Pending'}, {name: 'Active'}, {name: 'Paused'}, {name: 'Cancelled'}];
  startDateFilter: Array<any> = [{name: 'A-Z'}, {name: 'Z-A'}];
  endDateFilter: Array<any> = [{name: 'A-Z'}, {name: 'Z-A'}];
  influencersInSelectedList: Array<any> = [];
  query: any = {
    userId: '',
    paymentType: '',
    status: '',
    page: 1,
    limit: 25
  }

  constructor(private _findInfluencersService: FindInfluencersService,
              private _ListsService: CreateListService,
              private _ActionsService: ActionsService,
              private _CampaignsService: CampaignsService,
              public _viewContainerRef: ViewContainerRef,
              public _dialog: MatDialog) {
                self = this;
                this.onScroll = _.debounce(this.onScroll.bind(this), 200); // Debounce to 200ms
              }

  ngOnInit() {
    this.me();
  }

  me() {
    this.authService.me().subscribe({
      next: (response: any) => {
        this.userId = response.data._id;
        this.query.userId = this.userId;
        this.fetchMyCampaigns();
      }
    })
  }

  onScroll(event: any): void {
    const { scrollTop, scrollHeight, clientHeight } = event.target;

    // Check if the user has scrolled to the bottom
    if (scrollTop + clientHeight >= scrollHeight -10 && !this.isLoading && !this.isPageLoading && this.hasMoreData) {
      this.isMoreLoading = true;
      this.fetchMyCampaigns();
    }
  }

  fetchMyCampaigns(reset: boolean = false) {
    this.isLoading = true;
    if(reset) {
      this.query.page = 1;
      this.campaigns = [];
    }
    this._CampaignsService.fetchMyCampaigns(this.query).subscribe((response: any) => {
      if(response) {
        this.campaigns = _.concat(response.data, this.campaigns);
        this.campaignsExist = this.campaigns.length ? true : false;
        this.isLoading = false;
        this.isPageLoading = false;
        this.isMoreLoading = false;
        this.hasMoreData = (response.data.length == this.query.limit);
      } else {
        this.isLoading = false;
        this.isPageLoading = false;
        this.hasMoreData = false;
        this.isMoreLoading = false;
      }
    });
  }
  
  onSubmit() {
    
  }
  

  openCreateNewCampaignModal() {
    const config = new MatDialogConfig();

    config.autoFocus = false;
    config.disableClose = false;
    config.viewContainerRef = this._viewContainerRef;
    config.hasBackdrop = true;
    config.minWidth = '40vw';
    config.maxWidth = '40vw';
    config.minHeight = '82vh';
    config.maxHeight = '82vh';
    config.panelClass = 'custom-dialog-container';
    self.dialogRef = this._dialog.open(CreateNewCampaignComponent, config);
    self.dialogRef.componentInstance.data = [];
    self.dialogRef.componentInstance.userId = this.userId;
    self.dialogRef
      .afterClosed()
      .subscribe((response: any) => {
        self.dialogRef = null;
        if(response) {
          this.isLoading = true;
          this.fetchMyCampaigns(true);
        } else {
          this.isLoading = false;
        }
      });
  }

  openUpdateCampaignModal(campaign: any) {
    const config = new MatDialogConfig();

    config.autoFocus = false;
    config.disableClose = false;
    config.viewContainerRef = this._viewContainerRef;
    config.hasBackdrop = true;
    config.minWidth = '40vw';
    config.maxWidth = '40vw';
    config.minHeight = '82vh';
    config.maxHeight = '82vh';
    config.panelClass = 'custom-dialog-container';
    self.dialogRef = this._dialog.open(CreateNewCampaignComponent, config);
    self.dialogRef.componentInstance.data = [];
    self.dialogRef.componentInstance.campaign = campaign;
    self.dialogRef.componentInstance.userId = this.userId;
    self.dialogRef
      .afterClosed()
      .subscribe((response: any) => {
        self.dialogRef = null;
        if(response) {
          this.isLoading = true;
          this.fetchMyCampaigns(true);
        } else {
          this.isLoading = false;
        }
      });
  }

  openDeleteCampaignModal(campaign: any) {
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
    self.dialogRef = this._dialog.open(DeleteCampaignComponent, config);
    self.dialogRef.componentInstance.data = [];
    self.dialogRef.componentInstance.userId = this.userId;
    self.dialogRef.componentInstance.campaignId = campaign._id;
    self.dialogRef
      .afterClosed()
      .subscribe((response: any) => {
        self.dialogRef = null;
        if(response) {
          this.isLoading = true;
          this.fetchMyCampaigns(true);
        }
      });
  }

  onClearFilters() {
    this.isLoading = true;
    this.query.paymentType = '';
    this.query.status = '';
    document.getElementById('dropdownMenuLink1')!.innerHTML = 'Payment Type';
    document.getElementById('dropdownMenuLink2')!.innerHTML = 'Campaign Status'; 
    setTimeout(() => {
      this.fetchMyCampaigns(true);
    }, 500);
  }

  dropdownSelected(menu: string, item: any) {
    document.getElementById(menu)!.innerHTML = item;

    switch(menu) {
      case 'dropdownMenuLink1':
        this.query.paymentType = (item == 'One-Time') ? 'One-Time Payment' : 'Per Month';
        break;
      case 'dropdownMenuLink2':
        this.query.status = item;
        break;
      default:
        break;
    }

    this.isLoading = true;
    setTimeout(() => {
      this.fetchMyCampaigns(true);
    }, 500);
  }
}

