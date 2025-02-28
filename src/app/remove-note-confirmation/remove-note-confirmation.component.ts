import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-note-confirmation',
  standalone: true,
  imports: [NgIf, DragDropModule],
  templateUrl: './remove-note-confirmation.component.html',
  styleUrls: ['./remove-note-confirmation.component.scss']
})
export class RemoveNoteConfirmationComponent implements OnInit {
  isLoading: boolean = false;
  dialog!: MatDialogRef<any>;
  influencer: any;
  constructor(private dialogRef: MatDialogRef<any>) {

  }

  ngOnInit() {
    this.dialog = this.dialogRef;
  }

  onCancel() {
    this.dialog.close(false);
  }

  onRemoveNote() {
    this.dialog.close(true);
  }
}
