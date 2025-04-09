import { Component, inject, OnInit, ViewContainerRef } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { User } from '../core/model/common.model';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { CreateNoteComponent } from '../create-note/create-note.component';
import { CreateNewTaskComponent } from '../create-new-task/create-new-task.component'
import { CreateNewEventComponent } from '../create-new-event/create-new-event.component';
import { ToastrService } from 'ngx-toastr';
import { NgIf } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { ReportBugOrRequestFeatureComponent } from '../report-bug-or-request-feature/report-bug-or-request-feature.component';
let self: any;
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf, MatMenuModule, MatDialogModule,],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})

export class LayoutComponent implements OnInit {
  constructor(public _dialog: MatDialog, public _viewContainerRef: ViewContainerRef,
              public _toastr: ToastrService) {
    self = this;
  }
  authService = inject(AuthService);
  user!: User;

  ngOnInit() {
    this.authService.me().subscribe({
      next: (response: any) => {
        this.user = response.data;
      },
      error: (error: any) => {
        //an error will be returned if the token is expired
        this.authService.logout();
      }
    })
  }

  onLogout(){
    this.authService.logout();
  };

  openReportBugModal() {
      const config = new MatDialogConfig();
  
      config.autoFocus = false;
      config.disableClose = false;
      config.viewContainerRef = this._viewContainerRef;
      config.hasBackdrop = true;
      config.minWidth = '40vw';
      config.maxWidth = '40vw';
      config.minHeight = '80vh';
      config.maxHeight = '80vh';
      config.panelClass = 'custom-dialog-container';
      self.dialogRef = this._dialog.open(ReportBugOrRequestFeatureComponent, config);
      self.dialogRef.componentInstance.isReportBug = true;
      //self.dialogRef.componentInstance.data = [];
      self.dialogRef.componentInstance.userId = this.user._id;
      self.dialogRef
        .afterClosed()
        .subscribe((result: any) => {
          self.dialogRef = null;
          if (result) {
            //this._toastr.success('Note Created Successfully', 'Success');
          }
        });
  }

  openRequestFeatureModal() {
      const config = new MatDialogConfig();
  
      config.autoFocus = false;
      config.disableClose = false;
      config.viewContainerRef = this._viewContainerRef;
      config.hasBackdrop = true;
      config.minWidth = '40vw';
      config.maxWidth = '40vw';
      config.minHeight = '80vh';
      config.maxHeight = '80vh';
      config.panelClass = 'custom-dialog-container';
      self.dialogRef = this._dialog.open(ReportBugOrRequestFeatureComponent, config);
      //self.dialogRef.componentInstance.data = [];
      self.dialogRef.componentInstance.isReportBug = false;
      self.dialogRef.componentInstance.userId = this.user._id;
      self.dialogRef
        .afterClosed()
        .subscribe((result: any) => {
          self.dialogRef = null;
          if (result) {
            //this._toastr.success('Note Created Successfully', 'Success');
          }
        });
  }

  openCreateNote() {
      const config = new MatDialogConfig();
  
      config.autoFocus = false;
      config.disableClose = false;
      config.viewContainerRef = this._viewContainerRef;
      config.hasBackdrop = true;
      config.minWidth = '40vw';
      config.maxWidth = '40vw';
      config.minHeight = '80vh';
      config.maxHeight = '80vh';
      config.panelClass = 'custom-dialog-container';
      self.dialogRef = this._dialog.open(CreateNoteComponent, config);
      //self.dialogRef.componentInstance.data = [];
      self.dialogRef.componentInstance.userId = this.user._id;
      self.dialogRef
        .afterClosed()
        .subscribe((result: any) => {
          self.dialogRef = null;
          if (result) {
            //this._toastr.success('Note Created Successfully', 'Success');
          }
        });
  }

  openCreateTask() {
      const config = new MatDialogConfig();
    
      config.autoFocus = false;
      config.disableClose = false;
      config.viewContainerRef = this._viewContainerRef;
      config.hasBackdrop = true;
      config.minWidth = '40vw';
      config.maxWidth = '40vw';
      config.minHeight = '70vh';
      config.maxHeight = '70vh';
      config.panelClass = 'custom-dialog-container';
      self.dialogRef = this._dialog.open(CreateNewTaskComponent, config);
      self.dialogRef.componentInstance.data = [];
      self.dialogRef.componentInstance.userId = this.user._id;
      self.dialogRef
        .afterClosed()
        .subscribe((result: any) => {
          self.dialogRef = null;
          if (result) {
              //
          }
        });
    }

    openCreateEvent() {
        const config = new MatDialogConfig();
      
        config.autoFocus = false;
        config.disableClose = false;
        config.viewContainerRef = this._viewContainerRef;
        config.hasBackdrop = true;
        config.minWidth = '50vw';
        config.maxWidth = '50vw';
        config.minHeight = '58vh';
        config.maxHeight = '58vh';
        config.panelClass = 'custom-dialog-container';
        self.dialogRef = this._dialog.open(CreateNewEventComponent, config);
        self.dialogRef.componentInstance.data = [];
        self.dialogRef.componentInstance.userId = this.user._id;
        self.dialogRef
        .afterClosed()
        .subscribe((result: any) => {
          self.dialogRef = null;
          if (result) {
            //
          }
        });
    }
}
