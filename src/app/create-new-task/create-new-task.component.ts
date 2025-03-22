import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CreateTaskService } from './create-new-task.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import {MatSlideToggleChange, MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { HttpEvent } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-create-new-task',
  standalone: true,
  imports: [NgIf, FormsModule, ReactiveFormsModule, DragDropModule, MatDatepickerModule, NgxMaterialTimepickerModule, NgClass,
    MatFormFieldModule, MatNativeDateModule, MatInputModule, MatSlideToggleModule, NgFor, MatSelectModule],
  templateUrl: './create-new-task.component.html',
  styleUrls: ['./create-new-task.component.scss']
})
export class CreateNewTaskComponent  implements OnInit{
  private eventChannel = new BroadcastChannel('task_updates');
  form!: FormGroup;
  authService = inject(AuthService);
  router = inject(Router);
  isLoading: boolean = false;
  toDoForm!: FormGroup;
  fb = inject(FormBuilder);
  userId!: string;
  isPasswordsMatching: boolean = true;
  listAlreadyExists: boolean = false;
  priorityLevels: Array<any> = [{name: 'Low'}, {name: 'Medium'}, {name: 'High'}]
  influencerLists: Array<any> = [{name: 'Shawn Scott'}, {name: 'Ronea Taylor'}];
  influencerListNames: Array<any> = [];
  dialog!: MatDialogRef<any>;
  isAddToCalendar: boolean = false;
  isUpdate: boolean = false;
  isFlagTask: boolean = false;
  timeSelected: any;
  task: any;
  reminderOptions: Array<any> = [{name: '1 day before'}, {name: '1 hr before'}, {name: '30 mins before'}, {name: '15 mins before'}];
  statusOptions: Array<any> = [{name: 'Open'}, {name: 'In-Progress'}, {name: 'Done'}];
  editorConfig: any = {
    editable: true,
    spellcheck: true,
    height: '10rem',
    minHeight: '5rem',
    placeholder: 'Enter task description here...',
    translate: 'yes',
    width: 'auto',
    minWidth: '0',
    enableToolbar: true,
    showToolbar: true,
    defaultParagraphSeparator: '',
    defaultFontName: 'Arial',
    defaultFontSize: '2', // Default font size in pixels
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'}
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'http://localhost:3000/api/uploads/image', // Your API endpoint
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
    
    ]
  };

  constructor(private dialogRef: MatDialogRef<any>,
              private _CreateTaskService: CreateTaskService
  ) {

  }

  ngOnInit() {
    this.dialog = this.dialogRef;
    this.isUpdate = (this.task && this.task._id);
    this.buildForm();
  }

  buildForm() {
    this.toDoForm = this.fb.group({
      _id: [!this.isUpdate ? '' : this.task._id, []],
      title: [!this.isUpdate ? '' : this.task.title, [Validators.required]],
      userId: [this.userId, [Validators.required]],
      description: [!this.isUpdate ? '' : this.task.description, [Validators.required]],
      dueDate: [!this.isUpdate ? '' : this.task.dueDate, []],
      dueDateTime: [!this.isUpdate ? this.timeSelected : this.task.dueDateTime],
      reminder: [!this.isUpdate ? '' : this.task.reminder],
      priority: [!this.isUpdate ? '' : this.task.priority],
      flagged: [!this.isUpdate ? false : this.task.flagged],
      status: [!this.isUpdate ? '' : this.task.status, [Validators.required]]
    });
    //this.setDropdowns();
  }

  setDropdowns() {
    if(this.isUpdate) {
      if(this.task.status) {
        this.dropdownSelected('dropdownMenuLink8', this.task.status);
      }

      if(this.toDoForm.controls['priority'].value) {
        this.dropdownSelected('dropdownMenuLink7', this.task.priority);
      }

      if(this.toDoForm.controls['reminder'].value) {
        this.dropdownSelected('dropdownMenuLink6', this.task.reminder);
      }
    }
  }

  updateDueDate(dateObject: any){
    this.toDoForm.controls['dueDate'].setValue(dateObject.value);
  }

  onTimeChange(militaryTime: any) {
     this.timeSelected = militaryTime
  }
  

  onToggleChange(event: MatSlideToggleChange) {
    this.toDoForm.controls['flagged'].setValue(event.checked);
  }

  // Combine date and time into a single Date object
  private combineDateAndTime(date: Date, time: string): Date {
    if (!date || !time) return new Date();

    const [hours, minutes] = time.split(':').map(Number);
    const combined = new Date(date);
    combined.setHours(hours, minutes, 0, 0);
    return combined;
  }

  onSave() {
    this.isLoading = true;
    this.toDoForm.controls['time'].setValue(this.timeSelected);
    this._CreateTaskService.createNewTask(this.toDoForm.value).subscribe((response: any) => {
      setTimeout(() => {
        if(response) {
          this.isLoading = false;
          this.eventChannel.postMessage({ taskAdded: true });
          this.dialog.close(true);
        } else {
          this.isLoading = false;
          this.dialog.close(false);
        }
      }, 500)
    });
  }

  onUpdate() {
    this.isLoading = true;
    this._CreateTaskService.updateTask(this.toDoForm.value).subscribe((response: any) => {
      setTimeout(() => {
        if(response) {
          this.dialog.close(true);
          this.isLoading = false;
        } else {
          this.isLoading = false;
        }
      }, 500)
    });
  }

  onFlagTask() {
    this.isFlagTask = !this.isFlagTask;
  }

  dropdownSelected(menu: string, item: any) {
    document.getElementById(menu)!.innerHTML = item;

    switch(menu) {
      case 'dropdownMenuLink6':
        this.toDoForm.controls['reminder'].setValue(item);
        break;
      case 'dropdownMenuLink7':
        this.toDoForm.controls['priority'].setValue(item);
        break;
      case 'dropdownMenuLink8':
        this.toDoForm.controls['status'].setValue(item);
        break;
      default:
        break;
    }
  }
}
