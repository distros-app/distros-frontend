import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-influencer',
  standalone: true,
  imports: [NgIf],
  templateUrl: './remove-influencer.component.html',
  styleUrls: ['./remove-influencer.component.scss']
})
export class RemoveInfluencerComponent implements OnInit {
  isLoading: boolean = false;
  dialog!: MatDialogRef<any>;
  influencer: any;

  constructor(private dialogRef: MatDialogRef<any>) {

  }

  ngOnInit(){
    this.dialog = this.dialogRef;
  }

  onRemoveInfluencer() {

  }
}
