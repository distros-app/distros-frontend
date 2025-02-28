import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { NgIf } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { EventsService } from './create-new-event.service';


@Component({
  selector: 'app-create-new-event',
  standalone: true,
  imports: [NgIf, FormsModule, ReactiveFormsModule, DragDropModule, MatFormFieldModule, MatNativeDateModule, MatInputModule, MatDatepickerModule, NgxMaterialTimepickerModule],
  templateUrl: './create-new-event.component.html',
  styleUrls: ['./create-new-event.component.scss']
})
export class CreateNewEventComponent implements OnInit {
  private eventChannel = new BroadcastChannel('event_updates');
  form!: FormGroup;
  authService = inject(AuthService);
  router = inject(Router);
  isLoading: boolean = false;
  isUpdate: boolean = false;
  isUpdating: boolean = false;
  isCompleting: boolean = false;
  isDeleting: boolean = false;
  eventForm!: FormGroup;
  dateTimeForm!: FormGroup;
  fb = inject(FormBuilder);
  userId!: string;
  event: any;
  isPasswordsMatching: boolean = true;
  listAlreadyExists: boolean = false;
  influencerLists: Array<any> = [];
  influencerListNames: Array<any> = [];
  dialog!: MatDialogRef<any>;
  startTimeSelected!: string;
  endTimeSelected!: string;
  
  constructor(private dialogRef: MatDialogRef<any>, private _EventsService: EventsService) {

  }

  ngOnInit() {
    this.dialog = this.dialogRef;
    this.isUpdate = (this.event && this.event._id);
    this.getInfluencerListNames();
    this.me();
  }

  buildForm() {
    console.log('event:', this.event)
    this.eventForm = this.fb.group({
      name: [this.isUpdate ? this.event.name : '', [Validators.required]],
      userId: [this.userId, [Validators.required]],
      startDate: [this.isUpdate ? this.event.startDate : '', [Validators.required]],
      endDate: [this.isUpdate ? this.event.endDate : '', []],
      startTime: [this.isUpdate ? this.event.startTime : '', [Validators.required]],
      endTime: [this.isUpdate ? this.event.endTime : '', []],
      isComplete: [this.isUpdate ? this.event.isComplete : '', []],
    });

    this.eventForm.controls['name'].valueChanges.subscribe((value) => {
      if(this.influencerListNames.includes(value.toUpperCase().trim())) {
        this.listAlreadyExists = true;
      } else {
        this.listAlreadyExists = false;
      }
    });
  }

  me() {
    this.authService.me().subscribe({
      next: (response: any) => {
        this.userId = response.data._id
        this.buildForm();
      }
    })
  }

  getInfluencerListNames() {
    if(!this.influencerLists?.length) {
      this.influencerLists.push({name: 'No lists exist'});
    }

    for(let list of this.influencerLists) {
      this.influencerListNames.push(list.name.toUpperCase());
    }
  }

  onStartTimeChange(militaryTime: any) {
    //militaryTime = militaryTime.split(':');
    //const timeSelected = moment(militaryTime, 'HH:mm').format('h:mm A'); //convert in backend
    this.startTimeSelected = militaryTime;
  }

  onEndTimeChange(militaryTime: any) {
    //militaryTime = militaryTime.split(':');
    //const timeSelected = moment(militaryTime, 'HH:mm').format('h:mm A'); //convert in backend
    this.endTimeSelected = militaryTime;
  }

  onUpdate() {
    this.isUpdating = true;
    this.eventChannel.postMessage({ eventAdded: true });
  }

  onDelete() {
    this.isDeleting = true;
  }

  onComplete() {
    this.isCompleting = true;
  }

  onSave() {
    this.isLoading = true;
    this.eventForm.controls['startTime'].setValue(this.startTimeSelected);
    this.eventForm.controls['endTime'].setValue(this.endTimeSelected)
    this._EventsService.createEvent(this.eventForm.value).subscribe((response: any) => {
      setTimeout(() => {
        if(response) {
          this.eventChannel.postMessage({ eventAdded: true });
          this.isLoading = false;
          this.dialog.close(true);
        } else {
          this.isLoading = false;
        }
      }, 500);
    });
  }
}
