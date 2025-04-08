import { Component, inject, OnInit, ViewContainerRef } from '@angular/core';
import { FindInfluencersService } from '../find-influencers/find-influencers.service';
import { NgFor, NgIf } from '@angular/common';
import { AuthService } from '../core/services/auth.service';
import { User } from '../core/model/common.model';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { CreateNewListComponent } from '../create-new-list/create-new-list.component';
import { CreateListService } from '../create-new-list/create-new-list.service';
import { DeleteListComponent } from '../delete-list/delete-list.component';
import { RemoveInfluencerComponent } from '../delete-influencer/remove-influencer.component';
import { AddInfluencerToListComponent } from '../add-influencer-to-list/add-influencer-to-list.component';
import { ToastrService } from 'ngx-toastr';
import * as _ from "lodash";
import { MatMenuModule } from '@angular/material/menu';

let self: any;
@Component({
  selector: 'app-influencer-list-details',
  standalone: true,
  imports: [NgIf, NgFor, MatMenuModule],
  templateUrl: './influencer-list-details.component.html',
  styleUrls: ['./influencer-list-details.component.scss']
})

export class InfluencerListDetailsComponent {
  authService = inject(AuthService);
  userId!: string;
  user!: User;
  totalInfluencers: number = 0;
  isLoading: boolean = false;
  tableDataMessage: string = 'Please select a Current List';
  isListSelected: boolean = false;
  influencerListCreators: Array<any> = [];
  influencerLists: any;
  listName: string = 'Trainers Heat #1';
  influencerListsData: any;
  influencersInSelectedList: Array<any> = [];
  dialog!: MatDialogRef<any>;
  query: any = {
    userId: ''
  }

  constructor(private _findInfluencersService: FindInfluencersService,
              private _ListsService: CreateListService,
              public _viewContainerRef: ViewContainerRef,
              public _dialog: MatDialogRef<any>,
              private _toastr: ToastrService) {
                self = this;
              }

  ngOnInit() {
    this.dialog = this._dialog;
    this.calculateTotalInfluencers();
    //this.me();
  }

  me() {
    this.authService.me().subscribe({
      next: (response: any) => {
        this.userId = response.data._id;
        this.user = response.data;
        this.query.userId = this.userId;
        this.fetchMyInfluencerLists();
      }
    })
  }

  openSendEmailModal(influencer: any) {

  }

  copyEmail(email: string) {

  }


  onRemove(influencer: any) {
    const config = new MatDialogConfig();

    config.autoFocus = false;
    config.disableClose = false;
    config.viewContainerRef = this._viewContainerRef;
    config.hasBackdrop = true;
    config.minWidth = '40vw';
    config.maxWidth = '40vw';
    config.minHeight = '30vh';
    config.maxHeight = '30vh';
    //self.dialogRef = this._dialog.open(RemoveInfluencerComponent, config);
    self.dialogRef.componentInstance.userId = this.userId;
    self.dialogRef.componentInstance.influencer = influencer;
    self.dialogRef
      .afterClosed()
      .subscribe((result: any) => {
        self.dialogRef = null;
        if (result) {
          this.fetchMyInfluencerLists();
        }
      });
  }

  openAddToListModal(influencer: any) {
      const config = new MatDialogConfig();
  
      config.autoFocus = false;
      config.disableClose = false;
      config.viewContainerRef = this._viewContainerRef;
      config.hasBackdrop = true;
      config.minWidth = '45vw';
      config.maxWidth = '45vw';
      config.minHeight = '35vh';
      config.maxHeight = '70vh';
      //self.dialogRef = this._dialog.open(AddInfluencerToListComponent, config);
      self.dialogRef.componentInstance.data = [];
      self.dialogRef.componentInstance.newInfluencer = influencer;
      self.dialogRef
        .afterClosed()
        .subscribe((result: any) => {
          self.dialogRef = null;
          if (result) {
            this._toastr.success('Saved Successfully', 'Success');
          }
        });
  }

  fetchMyInfluencerLists() {
    this.isLoading = true;
    this._ListsService.fetchMyInfluencerLists(this.query).subscribe((response: any) => {
      if(response) {
        this.influencerLists = response.data;
        this.influencerListsData = _.cloneDeep(this.influencerLists);
        this.calculateTotalInfluencers();
        this.isLoading = false;
      } else {
        this.isLoading = false;
      }
    });
  }

  calculateTotalInfluencers() {
    this.totalInfluencers = 0;
    this.influencersInSelectedList = [];
    const influencers = this.influencerListsData.influencers;

    for(let influencer of influencers) {
      this.influencersInSelectedList.push(influencer);
      this.totalInfluencers++;
    }
  }

  fetchMoreInfluencersInList() {
    this.isLoading = true;
    setTimeout(() => {
      //this.influencersInSelectedList = [];
        this.tableDataMessage = `Showing ${this.influencerLists.length} ${this.influencerLists.length > 1 ? 'items' : 'item'} out of ${250} results found`;
        this.isLoading = false;
    }, 1500);
  }

  onCreateNewList() {
  
  }

  onAddCreatorToList() {

  }

  viewEmail(influencer: any) {
    if(!this.user.influencersEmailViewed.includes(influencer._id)) {
      let updateCountQuery = {
        userId: this.user._id,
        influencerId: influencer._id
      }

      this.authService.updateViewCount(updateCountQuery).subscribe({
        next: (response: any) => {

        }
      })
    }
  }
  
  onSubmit() {
    
  }

  dropdownSelected(menu: string, item: any) {
    document.getElementById(menu)!.innerHTML = item;
    this.isListSelected = true;
    this.filterLists(item)
    /*
    for(let list of this.influencerLists) {
      if(list.name === item.name) {
        this.influencersInSelectedList = list.influencers;

        if(this.influencersInSelectedList.length === 0) {
          this.tableDataMessage = 'It looks like there are no creators in your list yet'
        } else {
          this.tableDataMessage = `Showing ${this.influencerLists.length} ${this.influencerLists.length > 1 ? 'items' : 'item'} out of ${250} results found`;
        }
      }
    }
    */
  }

  filterLists(listName: string) {
    for(let list of this.influencerLists) {
      if(list.name === listName) {
        this.influencerListsData = [list];
      }
    }
    this.calculateTotalInfluencers();
  }
}

