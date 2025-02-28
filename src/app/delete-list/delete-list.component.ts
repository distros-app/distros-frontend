import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { NgFor, NgIf } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CreateListService } from '../create-new-list/create-new-list.service';

@Component({
  selector: 'app-delete-list',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, ReactiveFormsModule, DragDropModule],
  templateUrl: './delete-list.component.html',
  styleUrls: ['./delete-list.component.scss']
})

export class DeleteListComponent implements OnInit {
  form!: FormGroup;
  authService = inject(AuthService);
  router = inject(Router);
  isLoading: boolean = false;
  listForm!: FormGroup;
  fb = inject(FormBuilder);
  userId!: string;
  listMatchFound: boolean = false;
  isPasswordsMatching: boolean = true;
  dialog!: MatDialogRef<any>;
  influencerLists!: Array<any>;
  influencerListNames: Array<any> = [];
  listId!: string;
  deleteQuery = {
    userId: '',
    listId: ''
  }
  
  constructor(private dialogRef: MatDialogRef<any>, private _CreateListService: CreateListService) {

  }

  ngOnInit() {
    this.dialog = this.dialogRef;
    this.me();
    this.getInfluencerListNames();
    this.deleteQuery.listId = this.listId;
  }

  buildForm() {
    this.listForm = this.fb.group({
      name: ['', [Validators.required]],
      userId: [this.userId, [Validators.required]]
    });

    this.listForm.controls['name'].valueChanges.subscribe((value) => {
      if(this.influencerListNames.includes(value.toUpperCase().trim())) {
        this.listMatchFound = true;
      } else {
        this.listMatchFound = false;
      }
      console.log(this.listMatchFound)
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

  onCancel() {

  }

  onRemoveList() {
    
  }

  getInfluencerListNames() {
    for(let list of this.influencerLists) {
      this.influencerListNames.push(list.name.toUpperCase());
    }
  }

  dropdownSelected(val: any, val2: any) {
    console.log(val)
    console.log(val2)
  }

  onDelete() {
    this.isLoading = true;
    this._CreateListService.deleteList(this.deleteQuery).subscribe((response: any) => {
      setTimeout(() => {
        if(response) {
          this.dialog.close(true);
        } else {
          this.isLoading = false;
        }
      }, 500);
    });
  }
}
