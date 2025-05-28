import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import confetti from 'canvas-confetti';
import { MatRadioButton, MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { CampaignsService } from '../campaigns/campaigns.service';
import { CreateListService } from '../create-new-list/create-new-list.service';
import { TruncatePipe } from '../find-influencers/truncate.pipe';
import * as _ from 'lodash';
import { TitlecaseNamePipe } from '../actions/titlecase-name.pipe';


@Component({
  selector: 'app-create-new-campaign',
  standalone: true,
  imports: [NgIf, FormsModule, ReactiveFormsModule, DragDropModule, NgFor, MatRadioModule, MatFormFieldModule, 
            MatNativeDateModule, MatDatepickerModule, MatInputModule, NgStyle, TruncatePipe, NgClass, TitlecaseNamePipe],
  templateUrl: './create-new-campaign.component.html',
  styleUrls: ['./create-new-campaign.component.scss']
})
export class CreateNewCampaignComponent implements OnInit {
  @ViewChild('oneTimePaymentRadioButton') oneTimePaymentRadioButton!: MatRadioButton;
  @ViewChild('perMonthRadioButton') perMonthRadioButton!: MatRadioButton;
  @ViewChild('endDateRadioButton') endDateRadioButton!: MatRadioButton;
  form!: FormGroup;
  statusDropdownSelected: string = '';
  authService = inject(AuthService);
  router = inject(Router);
  selectedClient: any = null;
  startDateSelected: any;
  endDateSelected: any;
  isLoading: boolean = false;
  campaignForm!: FormGroup;
  isEndDateRadioChecked: boolean = false;
  isPerMonthRadioButton: boolean = false;
  isOneTimePaymentRadioButton: boolean = false;
  statuses: Array<any> = [{name: 'Pending'}, {name: 'Active'}, {name: 'Paused'}, {name: 'Cancelled'}]
  fb = inject(FormBuilder);
  userId!: string;
  campaign: any;
  clients: Array<any> = [];
  isPasswordsMatching: boolean = true;
  listAlreadyExists: boolean = false;
  influencerLists: Array<any> = [];
  influencerListNames: Array<any> = [];
  dialog!: MatDialogRef<any>;
  campaignDetails: string = '';
  isNoClients!: boolean;
  isUpdate!: boolean;
  isOneTimePayment!: boolean;
  isMonthlyPayment!: boolean;
  query: any = {
    userId: ''
  }
  
  constructor(private dialogRef: MatDialogRef<any>, private _CampaignsService: CampaignsService, private _ListsService: CreateListService
  ) {

  }

  ngOnInit() {
    this.isUpdate = (this.campaign && this.campaign._id);
    this.dialog = this.dialogRef;
    this.triggerConfetti();
    this.me();
  }

  triggerConfetti() {
    if(!this.isUpdate) {
      confetti({
        particleCount: 1000,
        spread: 150,
        origin: { y: 0.4 }
      });
    }
  }

  buildForm() {
    this.campaignForm = this.fb.group({
      _id: [!this.isUpdate ? '' : this.campaign._id, []],
      userId: [this.userId, [Validators.required]],
      name: [!this.isUpdate ? '' : this.campaign.name, []],
      clientName: [!this.isUpdate || (this.isUpdate && this.campaign.profilePic) ? '' : this.campaign.clientName, []], //fix the manual user field logic on update campaign screen
      profilePic: [!this.isUpdate ? '' : this.campaign.profilePic, []],
      compensation: [!this.isUpdate ? '' : this.campaign.compensation, [Validators.required]],
      compensationDuration: [!this.isUpdate ? '' : this.campaign.compensationDuration, [Validators.required]],
      isEndDate: [!this.isUpdate ? false : this.campaign.isEndDate, [Validators.required]],
      startDate: [!this.isUpdate ? '' : this.campaign.startDate, [Validators.required]],
      endDate: [!this.isUpdate ? '' : this.campaign.endDate, []],
      details: [!this.isUpdate ? '' : this.campaign.details, []],
      status: [!this.isUpdate ? '' : this.campaign.status, [Validators.required]]
    });

    if(this.isUpdate) {
      if(this.campaignForm.controls['compensationDuration'].value == 'One-Time Payment') {
        this.oneTimePaymentRadioChange();
      } else if(this.campaignForm.controls['compensationDuration'].value == 'Per Month') {
        this.perMonthRadioChange();
      }

      if(this.campaignForm.controls['isEndDate'].value) {
        this.endDateRadioChange();
      }

      const clientInDistros = this.campaign.name && this.campaign.profilePic;
      if(clientInDistros) {
        for(let client of this.clients) {
          if(client.fullName === this.campaign.name) {
            this.selectedClient = client;
          }
        }
      } else {
        this.selectedClient = false;
      }
      this.statusDropdownSelected = this.campaign.status;
    }
  }

  dropdownSelected(menu: string, item: any) {
      let sortItem = _.clone(item.fullName);
      //document.getElementById(menu)!.innerHTML = sortItem.length > 17 ? sortItem.slice(0, 17) + '...' : sortItem;
      if(sortItem != 'No influencers have been added to a list yet') {
        switch(menu) {
          case 'client':
            this.query.platform = item;
            this.selectedClient = item;
            this.campaignForm.controls['clientName'].setValue(null);
            this.campaignForm.controls['name'].setValue(item.fullName);
            this.campaignForm.controls['profilePic'].setValue(item.profilePic);
            break;
          case 'status':
            this.statusDropdownSelected = item.name;
            this.campaignForm.controls['status'].setValue(this.statusDropdownSelected);
            break;
          default:
            break;
        }
      }
  }

  onEnterClientManually() {
    this.selectedClient = null;
    this.campaignForm.controls['name'].setValue(null);
    this.campaignForm.controls['profilePic'].setValue(null);
  }

  me() {
    this.authService.me().subscribe({
      next: (response: any) => {
        this.userId = response.data._id
        this.query.userId = this.userId;
        this.fetchMyInfluencerLists();
      }
    });
  }

  async fetchMyInfluencerLists() {
    this._ListsService.fetchMyInfluencerLists(this.query).subscribe((response: any) => {
      if(response) {
        this.influencerLists = response.data;

        if(!this.influencerLists?.length) {
          this.isNoClients = true;
          this.clients.push({fullName: 'No influencers have been added to a list yet'});
        } else {
          this.isNoClients = false;
        }
  
        this.getInfluencerListNames();
        this.getInfluencerFromAllLists();
        this.buildForm();
      }
    });
  }

  updateStartDate(dateObject: any) {
    this.campaignForm.controls['startDate'].setValue(dateObject.value);
  }

  updateEndDate(dateObject: any) {
    this.campaignForm.controls['endDate'].setValue(dateObject.value);
  }

  getInfluencerFromAllLists() {
    for(let list of this.influencerLists) {
      for (let influencer of list?.influencers ?? []) {
        if(!this.clients.some(existing => existing._id === influencer._id)) {
          this.clients.push(influencer);
        }
      }
    }
  }

  getInfluencerListNames() {
    if(!this.influencerLists?.length) {
      this.influencerLists.push({name: 'No lists exist'});
    }

    for(let list of this.influencerLists) {
      this.influencerListNames.push(list.name.toUpperCase());
    }
  }

  oneTimePaymentRadioChange() {
    this.isOneTimePaymentRadioButton = !this.isOneTimePaymentRadioButton;
    this.campaignForm.controls['compensationDuration'].setValue('One-Time Payment');
  }

  perMonthRadioChange() {
    this.isPerMonthRadioButton = !this.isPerMonthRadioButton;
    this.campaignForm.controls['compensationDuration'].setValue('Per Month');
  }

  endDateRadioChange() {
    this.isEndDateRadioChecked = !this.isEndDateRadioChecked;
    this.campaignForm.controls['isEndDate'].setValue('1');

    if(!this.isEndDateRadioChecked) {
      this.campaignForm.controls['endDate'].setValue(null);
    }
  }

  onSave() {
    this.isLoading = true;
    if(!this.campaignForm.controls['name'].value && this.selectedClient) {
      this.campaignForm.controls['name'].setValue(this.selectedClient.fullName);
    }
    
    this._CampaignsService.createCampaign(this.campaignForm.value).subscribe((response: any) => {
      setTimeout(() => {
        if(response) {
          this.isLoading = false;
          this.dialog.close(true);
        } else {
          this.isLoading = false;
        }
      }, 500);
    });
  }

  onUpdate() {
    this.isLoading = true;

    this._CampaignsService.updateCampaign(this.campaignForm.value).subscribe((response: any) => {
      setTimeout(() => {
        if(response) {
          this.isLoading = false;
          this.dialog.close(true);
        } else {
          this.isLoading = false;
        }
      }, 500);
    });
  }
}