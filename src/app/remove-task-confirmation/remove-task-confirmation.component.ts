import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateTaskService } from '../create-new-task/create-new-task.service';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-remove-task-confirmation',
  standalone: true,
  imports: [NgIf, DragDropModule],
  templateUrl: './remove-task-confirmation.component.html',
  styleUrls: ['./remove-task-confirmation.component.scss']
})
export class RemoveTaskConfirmationComponent {
  isLoading: boolean = false;
  dialog!: MatDialogRef<any>;
  influencer: any;
  isDeleting: boolean = false;
  taskId!: string;
  userId!: string;
  deleteQuery = {
    userId: '',
    taskId: ''
  }
  constructor(private dialogRef: MatDialogRef<any>, public _TasksService: CreateTaskService) {

  }

  ngOnInit() {
    this.dialog = this.dialogRef;
    this.deleteQuery.userId = this.userId;
    this.deleteQuery.taskId = this.taskId;
  }

  onCancel() {
    this.dialog.close(false);
  }

  onRemoveTask() {
    this.isDeleting = true;
    console.log(this.deleteQuery)
    this._TasksService.deleteTask(this.deleteQuery).subscribe((response: any) => {
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
}

