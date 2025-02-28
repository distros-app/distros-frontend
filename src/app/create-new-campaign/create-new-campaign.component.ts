import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { NgFor, NgIf, NgStyle } from '@angular/common';
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
import * as _ from 'lodash';


@Component({
  selector: 'app-create-new-campaign',
  standalone: true,
  imports: [NgIf, FormsModule, ReactiveFormsModule, DragDropModule, NgFor, MatRadioModule, MatFormFieldModule, 
            MatNativeDateModule, MatDatepickerModule, MatInputModule, NgStyle],
  templateUrl: './create-new-campaign.component.html',
  styleUrls: ['./create-new-campaign.component.scss']
})
export class CreateNewCampaignComponent implements OnInit {
  @ViewChild('oneTimePaymentRadioButton') oneTimePaymentRadioButton!: MatRadioButton;
  @ViewChild('perMonthRadioButton') perMonthRadioButton!: MatRadioButton;
  @ViewChild('endDateRadioButton') endDateRadioButton!: MatRadioButton;
  form!: FormGroup;
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
  query: any = {
    userId: ''
  }
  
  constructor(private dialogRef: MatDialogRef<any>, private _CampaignsService: CampaignsService, private _ListsService: CreateListService
  ) {

  }

  ngOnInit() {
    this.isUpdate = (this.campaign && this.campaign._id);
    if(!this.isUpdate) this.triggerConfetti();
    this.dialog = this.dialogRef;
    this.me();
  }

  triggerConfetti() {
    confetti({
      particleCount: 1000,
      spread: 150,
      origin: { y: 0.4 }
    });
  }

  buildForm() {
    this.campaignForm = this.fb.group({
      _id: [!this.isUpdate ? '' : this.campaign._id, []],
      userId: [this.userId, [Validators.required]],
      clientName: [!this.isUpdate ? '' : this.campaign.clientName, [Validators.required]],
      profilePic: [!this.isUpdate ? '' : this.campaign.profilePic, [Validators.required]],
      compensation: [!this.isUpdate ? '' : this.campaign.compensation, [Validators.required]],
      duration: [!this.isUpdate ? '' : this.campaign.compensationDuration, [Validators.required]],
      isEndDate: [!this.isUpdate ? false : this.campaign.isEndDate, [Validators.required]],
      startDate: [!this.isUpdate ? '' : this.campaign.startDate, [Validators.required]],
      endDate: [!this.isUpdate ? '' : this.campaign.endDate, []],
      details: [!this.isUpdate ? '' : this.campaign.details, []]
    });
  }

  dropdownSelected(menu: string, item: any) {
      let sortItem = _.clone(item.name);
      console.log('sortItem:', sortItem);
      //document.getElementById(menu)!.innerHTML = sortItem.length > 17 ? sortItem.slice(0, 17) + '...' : sortItem;
  
      switch(menu) {
        case 'client':
          this.query.platform = item;
          this.selectedClient = item;
          this.campaignForm.controls['clientName'].setValue(null);
          break;
        default:
          break;
      }
  }

  onEnterClientManually() {
    this.selectedClient = null;
  }

  me() {
    this.authService.me().subscribe({
      next: (response: any) => {
        this.userId = response.data._id
        this.query.userId = this.userId;
        this.buildForm();
        this.fetchMyInfluencerLists();
      }
    });
  }

  async fetchMyInfluencerLists() {
    this._ListsService.fetchMyInfluencerLists(this.query).subscribe((response: any) => {
      if(response) {
        this.influencerLists = response.data;
      }

      if(!this.influencerLists.length) {
        this.isNoClients = true;
        this.clients.push({name: 'No influencers have been added to a list yet'});
      } else {
        this.isNoClients = false;
      }
      this.buildForm();
      this.getInfluencerListNames();
      this.getInfluencerFromAllLists();
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
      console.log(this.influencerLists)
      for(let influencer of list.influencers) {
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
    this.oneTimePaymentRadioButton.checked = this.isOneTimePaymentRadioButton;
    this.campaignForm.controls['duration'].setValue('One-Time Payment');
  }

  perMonthRadioChange() {
    this.isPerMonthRadioButton = !this.isPerMonthRadioButton;
    this.perMonthRadioButton.checked = this.isPerMonthRadioButton;
    this.campaignForm.controls['duration'].setValue('Per Month');
  }

  endDateRadioChange() {
    this.isEndDateRadioChecked = !this.isEndDateRadioChecked;
    this.endDateRadioButton.checked = this.isEndDateRadioChecked;
    this.campaignForm.controls['isEndDate'].setValue(this.endDateRadioButton.checked);

    if(!this.isEndDateRadioChecked) {
      this.campaignForm.controls['endDate'].setValue(null);
    }
  }

  onSave() {
    this.isLoading = true;
    if(!this.campaignForm.controls['clientName'].value) {
      this.campaignForm.controls['clientName'].setValue(this.selectedClient.name);
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