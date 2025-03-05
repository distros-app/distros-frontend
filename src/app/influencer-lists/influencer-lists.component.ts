import { Component, inject, OnInit, ViewContainerRef } from '@angular/core';
import { FindInfluencersService } from '../find-influencers/find-influencers.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { AuthService } from '../core/services/auth.service';
import { User } from '../core/model/common.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateNewListComponent } from '../create-new-list/create-new-list.component';
import { CreateListService } from '../create-new-list/create-new-list.service';
import { DeleteListComponent } from '../delete-list/delete-list.component';
import { RemoveInfluencerComponent } from '../delete-influencer/remove-influencer.component';
import { AddInfluencerToListComponent } from '../add-influencer-to-list/add-influencer-to-list.component';
import { ToastrService } from 'ngx-toastr';
import * as _ from "lodash";
import { InfluencerListDetailsComponent } from '../influencer-list-details/influencer-list-details.component';

let self: any;
@Component({
  selector: 'app-influencer-lists',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule],
  templateUrl: './influencer-lists.component.html',
  styleUrls: ['./influencer-lists.component.scss']
})

export class InfluencerListsComponent implements OnInit {
  authService = inject(AuthService);
  userId!: string;
  totalInfluencers: number = 0;
  isLoading: boolean = true;
  tableDataMessage: string = 'Please select a Current List';
  isListSelected: boolean = false;
  influencerListCreators: Array<any> = [];
  influencerLists: Array<any> = [];
  influencerListsData: Array<any> = [];
  influencersInSelectedList: Array<any> = [];
  query: any = {
    page: 1,
    limit: 25,
    userId: ''
  }

  constructor(private _findInfluencersService: FindInfluencersService,
              private _ListsService: CreateListService,
              public _viewContainerRef: ViewContainerRef,
              public _dialog: MatDialog,
              private _toastr: ToastrService) {
                self = this;
              }

  ngOnInit() {
    this.me();
  }

  me() {
    this.authService.me().subscribe({
      next: (response: any) => {
        this.userId = response.data._id;
        this.query.userId = this.userId;
        this.fetchMyInfluencerLists();
      }
    })
  }

  openInfluencerListDetailsModal(list: any) {
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
    self.dialogRef = this._dialog.open(InfluencerListDetailsComponent, config);
    self.dialogRef.componentInstance.influencerLists = list;
    self.dialogRef.componentInstance.influencerListsData = list;
    self.dialogRef.componentInstance.userId = this.userId;
    self.dialogRef
      .afterClosed()
      .subscribe((result: any) => {
        self.dialogRef = null;
       
        if (result) {
          
        }
      });
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
    self.dialogRef = this._dialog.open(RemoveInfluencerComponent, config);
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
      self.dialogRef = this._dialog.open(AddInfluencerToListComponent, config);
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

  fetchMyInfluencerLists(reset: boolean = false) {
    this.isLoading = true;
    if(reset) {
      this.query.page = 1;
      this.influencerLists = [];
      this.influencerListsData = [];
    }

    this._ListsService.fetchMyInfluencerLists(this.query).subscribe((response: any) => {
      if(response) {
        this.influencerLists = response.data;
        this.influencerListsData = _.cloneDeep(this.influencerLists);
        this.calculateTotalInfluencers();
        console.log(this.influencerListsData);
        this.isLoading = false;
      } else {
        this.isLoading = false;
      }
    });
  }

  onClearFilters() {

  }

  calculateTotalInfluencers() {
    this.totalInfluencers = 0;
    this.influencersInSelectedList = [];

    for(let list of this.influencerListsData) {
      for(let influencer of list.influencers) {
        this.influencersInSelectedList.push(influencer);
        this.totalInfluencers++;
      }
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
  
  onSubmit() {
    
  }

  openCreateNewListModal() {
    const config = new MatDialogConfig();

    config.autoFocus = false;
    config.disableClose = false;
    config.viewContainerRef = this._viewContainerRef;
    config.hasBackdrop = true;
    config.minWidth = '40vw';
    config.maxWidth = '40vw';
    config.minHeight = '35vh';
    config.maxHeight = '35vh';
    config.panelClass = 'custom-dialog-container';
    self.dialogRef = this._dialog.open(CreateNewListComponent, config);
    self.dialogRef.componentInstance.data = [];
    self.dialogRef.componentInstance.userId = this.userId;
    self.dialogRef
      .afterClosed()
      .subscribe((result: any) => {
        self.dialogRef = null;
        if (result) {
          //this.fetchMyInfluencerLists();
          this.influencerLists.push(result);  
        }
      });
  }

  openDeleteListModal(list: any) {
    const config = new MatDialogConfig();

    config.autoFocus = false;
    config.disableClose = false;
    config.viewContainerRef = this._viewContainerRef;
    config.hasBackdrop = true;
    config.minWidth = '40vw';
    config.maxWidth = '40vw';
    config.minHeight = '35vh';
    config.maxHeight = '35vh';
    self.dialogRef = this._dialog.open(DeleteListComponent, config);
    self.dialogRef.componentInstance.data = [];
    self.dialogRef.componentInstance.userId = this.userId;
    self.dialogRef.componentInstance.influencerLists = this.influencerLists;
    self.dialogRef.componentInstance.listId = list._id;
    self.dialogRef
      .afterClosed()
      .subscribe((result: any) => {
        self.dialogRef = null;
        if (result) {
          this.fetchMyInfluencerLists();
        }
      });
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
