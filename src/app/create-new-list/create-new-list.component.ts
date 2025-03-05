import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { NgIf } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateListService } from './create-new-list.service';
import { DragDropModule } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-create-new-list',
  standalone: true,
  imports: [NgIf, FormsModule, ReactiveFormsModule, DragDropModule],
  templateUrl: './create-new-list.component.html',
  styleUrls: ['./create-new-list.component.scss']
})
export class CreateNewListComponent implements OnInit {
  form!: FormGroup;
  authService = inject(AuthService);
  router = inject(Router);
  isLoading: boolean = false;
  listForm!: FormGroup;
  fb = inject(FormBuilder);
  userId!: string;
  isPasswordsMatching: boolean = true;
  listAlreadyExists: boolean = false;
  influencerLists: Array<any> = [];
  influencerListNames: Array<any> = [];
  dialog!: MatDialogRef<any>;
  query = {
    userId: ''
  }
  
  constructor(private dialogRef: MatDialogRef<any>, private _CreateListService: CreateListService, private _ListsService: CreateListService) {

  }

  ngOnInit() {
    this.dialog = this.dialogRef;
    this.fetchMyInfluencerLists();
  }

  buildForm() {
    this.listForm = this.fb.group({
      name: ['', [Validators.required]],
      userId: [this.userId, [Validators.required]]
    });

    this.listForm.controls['name'].valueChanges.subscribe((value) => {
      if(this.influencerListNames.includes(value.toUpperCase().trim())) {
        this.listAlreadyExists = true;
      } else {
        this.listAlreadyExists = false;
      }
    });
  }

  fetchMyInfluencerLists() {
    this.query.userId = this.userId;
    console.log(this.query)
    this._ListsService.fetchMyInfluencerLists(this.query).subscribe((response: any) => {
      if(response) {
        this.influencerLists = response.data;
        console.log(this.influencerLists)
        this.getInfluencerListNames();
        this.buildForm();
      }
    });
  }

  getInfluencerListNames() {
    if(!this.influencerLists?.length) {
      this.influencerLists.push({name: 'No lists exist'});
    }

    for(let list of this.influencerLists) {
      this.influencerListNames.push(list.name.toUpperCase());
    }
  }

  onSave() {
    this.isLoading = true;
    this._CreateListService.createNewList(this.listForm.value).subscribe((response: any) => {
      setTimeout(() => {
        if(response) {
          this.dialog.close(response.data);
        } else {
          this.isLoading = false;
        }
      }, 500);
    });
  }
}
