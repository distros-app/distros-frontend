import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, map } from 'rxjs';

@Component({
  selector: 'app-all-filters',
  standalone: true,
  imports: [MatCheckboxModule, FormsModule, NgFor, NgIf, DragDropModule, CommonModule],
  templateUrl: './all-filters.component.html',
  styleUrls: ['./all-filters.component.scss']
})
export class AllFiltersComponent implements OnInit {
  dialog!: MatDialogRef<any>;
  isLoading: boolean = false;
  filter1: boolean = true;
  filter2: boolean = true;
  filters: Array<any> = [{name: 'Exclude influencers that were already added to a list', checked: true}, {name: 'Exclude hidden influencers', checked: true}]
  // BehaviorSubject to manage the task object
  task = new BehaviorSubject<any>({
    name: 'Parent task',
    completed: true,
    subtasks: [
      { name: 'Exclude influencers that were already added to a list', completed: false },
      { name: 'Exclude hidden influencers', completed: false },
    ],
  });

  // Derived observable to compute the 'partiallyComplete' status
  partiallyComplete$ = this.task.pipe(
    map((task) => {
      if (!task.subtasks) {
        return false;
      }
      return task.subtasks.some((t: any) => t.completed) && !task.subtasks.every((t: any) => t.completed);
    })
  );

  constructor(private dialogRef: MatDialogRef<any>) {

  }

  ngOnInit() {
    this.dialog = this.dialogRef;
  }

  update(completed: boolean, index: number) {
    const currentTask = this.task.value;
    
    // Toggle subtask completion
    currentTask.subtasks[index].completed = completed;

    // Check if all subtasks are completed to update task's completion status
    currentTask.completed = currentTask.subtasks?.every((t: any) => t.completed) ?? true;

    // Emit updated task state
    this.task.next({ ...currentTask });
  }

  applyFilters() {
    this.dialogRef.close(this.filters);
  }
}
