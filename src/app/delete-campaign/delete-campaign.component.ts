import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { NgFor, NgIf } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CreateListService } from '../create-new-list/create-new-list.service';
import { CampaignsService } from '../campaigns/campaigns.service';

@Component({
  selector: 'app-delete-campaign',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, ReactiveFormsModule, DragDropModule],
  templateUrl: './delete-campaign.component.html',
  styleUrls: ['./delete-campaign.component.scss']
})

export class DeleteCampaignComponent implements OnInit {
  form!: FormGroup;
  authService = inject(AuthService);
  router = inject(Router);
  isLoading: boolean = false;
  listForm!: FormGroup;
  fb = inject(FormBuilder);
  userId!: string;
  listMatchFound: boolean = false;
  isDeleting: boolean = false;
  isPasswordsMatching: boolean = true;
  dialog!: MatDialogRef<any>;
  influencerLists!: Array<any>;
  influencerListNames: Array<any> = [];
  campaignId!: string;
  deleteQuery = {
    userId: '',
    campaignId: ''
  }
  
  constructor(private dialogRef: MatDialogRef<any>, private _CampaignService: CampaignsService) {

  }

  ngOnInit() {
    this.dialog = this.dialogRef;
    this.deleteQuery.campaignId = this.campaignId;
    this.me();
  }

  buildForm() {
    this.listForm = this.fb.group({
      name: ['', [Validators.required]],
      userId: [this.userId, [Validators.required]]
    });
  }

  me() {
    this.authService.me().subscribe({
      next: (response: any) => {
        this.userId = response.data._id
        this.deleteQuery.userId = this.userId;
        this.buildForm();
      }
    })
  }

  dropdownSelected(val: any, val2: any) {
    console.log(val)
    console.log(val2)
  }

  onRemoveCampaign() {
    this.isDeleting = true;
    this._CampaignService.deleteCampaign(this.deleteQuery).subscribe((response: any) => {
      setTimeout(() => {
        if(response) {
          this.isDeleting = false;
          this.dialog.close(true);
        } else {
          this.isDeleting = false;
        }
      }, 500);
    });
  }

  onCancel() {
    this.dialog.close(false);
  }
}
