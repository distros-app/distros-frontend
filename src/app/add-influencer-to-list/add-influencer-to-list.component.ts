import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CreateListService } from '../create-new-list/create-new-list.service';
import { AuthService } from '../core/services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-influencer-to-list',
  standalone: true,
  imports: [NgFor, DragDropModule, NgIf, NgClass],
  templateUrl: './add-influencer-to-list.component.html',
  styleUrls: ['./add-influencer-to-list.component.scss']
})
export class AddInfluencerToListComponent implements OnInit {
  authService = inject(AuthService);
  userId!: string;
  description: string = '';
  newInfluencer: any;
  influencerLists: Array<any> = [];
  influencerListTypes: Array<any> = [{name: 'Candidates'}, {name: 'Contacted'}, {name: 'Negotiations'}, {name: 'Approved'}];
  dialog!: MatDialogRef<any>;
  isShowDetails: boolean = true;
  isLoading: boolean = false;
  isInfluencerListEmpty!: boolean;
  form!: FormGroup;
  query: any = {
    userId: '',
  }

  constructor(private dialogRef: MatDialogRef<any>,
              private _ListsService: CreateListService,
              private fb: FormBuilder,
              private _CreateListService: CreateListService
            ) { 
              
            }
  
  ngOnInit() {
    this.dialog = this.dialogRef;
    this.me();
  }

  dropdownSelected(menu: string, item: any) {
    if(!this.isInfluencerListEmpty || menu !== 'list') document.getElementById(menu)!.innerHTML = item.name;
    switch(menu) {
      case 'list':
        if(!this.isInfluencerListEmpty) this.form.controls['listName'].setValue(item.name);
        break;
      case 'status':
        this.form.controls['influencerStatus'].setValue(item.name);
        break;
      default:
        break;
    }
  }

  buildForm() {
    this.form = this.fb.group({
      userId: new FormControl(this.userId, [Validators.required]),
      listName: new FormControl('', [Validators.required]),
      influencerStatus: new FormControl('', [Validators.required]),
      description: new FormControl('', []),
      newInfluencer: new FormControl(this.newInfluencer, [Validators.required])
    });
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

  onKeyUp(description: string) {
    this.description = description;
  }

  async fetchMyInfluencerLists() {
    this._ListsService.fetchMyInfluencerLists(this.query).subscribe((response: any) => {
      if(response) {
        this.influencerLists = response.data;
      }

      if(!this.influencerLists.length) {
        this.isInfluencerListEmpty = true;
        this.influencerLists.push({name: 'No lists exist'});
      } else {
        this.isInfluencerListEmpty = false;
      }
      this.buildForm();
    });
  }

  openMoreDetails() {
    this.isShowDetails = !this.isShowDetails;
  }

  onSave() {
    this.isLoading = true;
    if(this.description) this.form.controls['description'].setValue(this.description);
    this._CreateListService.updateList(this.form.value).subscribe((response: any) => {
      if(response) {
        this.dialog.close(true);
      } else {
        this.isLoading = false;
      }
    });
  }
}
