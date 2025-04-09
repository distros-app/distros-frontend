import { Component, inject, OnInit, ViewContainerRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { CreateNewTaskComponent } from '../create-new-task/create-new-task.component';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { CreateTaskService } from '../create-new-task/create-new-task.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CreateNoteComponent } from '../create-note/create-note.component';
import { NotesService } from './notes.service';
import { SortComponent } from '../sort/sort.component';
import { ActionsService } from '../actions/actions.service';
import { RemoveNoteConfirmationComponent } from '../remove-note-confirmation/remove-note-confirmation.component';
import { Editor, NgxEditorModule } from 'ngx-editor';
import * as _ from 'lodash';

let self: any;
@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [NgIf, NgFor, DragDropModule, NgClass, FormsModule, ReactiveFormsModule, NgxEditorModule],
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})

export class NotesComponent implements OnInit{
  private eventChannel = new BroadcastChannel('note_updates');
  userId!: string;
  dialog!: MatDialogRef<any>;
  notesForm!: FormGroup;
  deleteNoteForm!: FormGroup;
  isUpdateNote: boolean = true;
  isIconClicked: boolean = false;
  isPageLoading: boolean = true;
  notes: any[] = [];
  allNotes: any[] = [];
  fb = inject(FormBuilder);
  inProgress: any[] = [];
  done: any[] = [];
  updateId!: any;
  activeNoteId: string = '';
  isEditEnabled: boolean = false;
  authService = inject(AuthService);
  isSaving: boolean = false;
  isDeleting: boolean = false;
  isLoading: boolean = true;
  html = '';
  editor!: Editor;
  query = {
    userId: '',
    task: ''
  }
  deleteQuery = {
    userId: '',
    noteId: ''
  }
    editorConfig: any = {
      editable: true,
      spellcheck: true,
      height: '21rem',
      minHeight: '5rem',
      placeholder: 'Enter note description here...',
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
      ],
      uploadUrl: 'http://localhost:3000/api/uploads/image', // Your API endpoint
      //upload: (file: File) => this.handleImageUpload(file),
      uploadWithCredentials: false,
      sanitize: true,
      toolbarPosition: 'top',
      toolbarHiddenButtons: [
        ['customClasses'],
        ['removeFormat'],
        ['subscript', 'superscript'],
        ['insertImage', 'insertVideo'], 
      ]
    };

  constructor(public _viewContainerRef: ViewContainerRef, public _dialog: MatDialog, public _TasksService: CreateTaskService,
              public _NotesService: NotesService, public _ActionsService: ActionsService
  ) {
    self = this;
  }

  ngOnInit() {
    this.me();
    this.editor = new Editor();

    // Listen for event updates
    this.eventChannel.onmessage = (message) => {
      if (message.data.noteAdded) {
        this.fetchMyNotes();
      }
    };
  }

  fetchMyNotes(reset: boolean = false) {
    this.isLoading = true;
    this._NotesService.fetchMyNotes(this.query).subscribe((response: any) => {
      if(response) {
        this.notes = response.data;
        this.convertDataOnInit(reset);
        this.isLoading = false;
        this.isPageLoading = false;
        //this.sortNotes();
      } else {
        this.isLoading = false;
        this.isPageLoading = false;
      }
    });
  }

  onCreateNewNote () {
    this.isUpdateNote = false;
    this.isIconClicked = true;
    for(let note of this.notes) {
      note.isActive = false;
    }
    this.notesForm.controls['editorContent'].setValue('');
    this.notesForm.controls['noteTitle'].setValue('');
  }

  convertDataOnInit(reset: boolean = false) {
    let i: number = 0;
    let htmlContentActive;
    for(let note of this.notes) {
      const htmlContent = note.description;
      const tempDiv = document.createElement('div'); // Create a temporary element
      tempDiv.innerHTML = htmlContent; // Assign the HTML content
      const text = tempDiv.textContent || tempDiv.innerText; // Extract text content
      note.convertedDescription = text;
      const createdDate = note.createdDate.split(' ').slice(0, 4).join(' ');
      note.createdDate = createdDate;
      if(reset) {
        note.isActive = note._id == this.activeNoteId ? true : false;
        if(note.isActive) {
          htmlContentActive = htmlContent;
          this.notesForm.controls['editorContent'].setValue(htmlContentActive);
          this.notesForm.controls['noteTitle'].setValue(note.title);
        }
      } else {
        note.isActive = i === 0 ? true : false;
        if(note.isActive) {
          this.activeNoteId = note._id;
          htmlContentActive = htmlContent;
        }
      }
      i++;
    }
    
    if(!reset) {
      this.notesForm.controls['editorContent'].setValue(htmlContentActive);
      this.notesForm.controls['noteTitle'].setValue(this.notes[0]?.title);
    }
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
    self.dialogRef = this._dialog.open(CreateNoteComponent, config);
    //self.dialogRef.componentInstance.data = [];
    self.dialogRef.componentInstance.userId = this.query.userId;
    self.dialogRef
      .afterClosed()
      .subscribe((result: any) => {
        self.dialogRef = null;
        if (result) {
          this.fetchMyNotes(true);
          //this._toastr.success('Note Created Successfully', 'Success');
        }
      });
}

  onRemove() {
    if(this.notesForm.valid) {
      const config = new MatDialogConfig();
  
      config.autoFocus = false;
      config.disableClose = false;
      config.viewContainerRef = this._viewContainerRef;
      config.hasBackdrop = true;
      config.minWidth = '40vw';
      config.maxWidth = '40vw';
      config.minHeight = '30vh';
      config.maxHeight = '30vh';
      config.panelClass = 'custom-dialog-container';
      self.dialogRef = this._dialog.open(RemoveNoteConfirmationComponent, config);
      self.dialogRef
        .afterClosed()
        .subscribe((response: any) => {
          self.dialogRef = null;
          if (response) {
            this.isDeleting = true;
            this.deleteQuery.noteId = this.activeNoteId;
              this._NotesService.deleteNote(this.deleteQuery).subscribe({
                next: (response: any) => {
                  if(response) {
                    setTimeout(() => {
                      this.fetchMyNotes();
                      this.isDeleting = false;  
                    }, 500)
                  }
                },
                error: (error: Error) => {
                  setTimeout(() => {
                    this.isDeleting = false;
                  }, 500);
                }
              });
          } else {
            this.isDeleting = false;
          }
        });
    }
  }

  sortNotes() {
    /*
    for(let note of this.allNotes) {
      if(note.status === 'TO DO') {
        this.notes.push(note);
      } else if(note.status === 'IN PROGRESS') { 
        this.inProgress.push(note);
      } else { //DONE
        this.done.push(note);
      }
    }
    this.isLoading = false;
    */
  }

  me() {
    this.authService.me().subscribe({
      next: (response: any) => {
        this.userId = response.data._id;
        this.query.userId = this.userId;
        this.deleteQuery.userId = this.userId;
        this.buildForm();
        this.fetchMyNotes();
      }
    })
  }

  buildForm() {
      this.notesForm = this.fb.group({
        _id: ['', []],
        userId: [this.userId, [Validators.required]],
        noteTitle: ['', []],
        editorContent: ['', [Validators.required]], // Initialize with empty or default value
      });

      this.deleteNoteForm = this.fb.group({
        _id: ['', [Validators.required]],
        userId: [this.userId, [Validators.required]]
      });
    }

  openSortModal() {
    const config = new MatDialogConfig();

    config.autoFocus = false;
    config.disableClose = false;
    config.viewContainerRef = this._viewContainerRef;
    config.hasBackdrop = true;
    config.minWidth = '30vw';
    config.maxWidth = '30vw';
    config.minHeight = '40vh';
    config.maxHeight = '40vh';
    config.panelClass = 'custom-dialog-container';
    self.dialogRef = this._dialog.open(SortComponent, config);
    self.dialogRef.componentInstance.data = [];
    self.dialogRef.componentInstance.userId = this.userId;
    self.dialogRef.componentInstance.influencerLists = '';
    self.dialogRef
      .afterClosed()
      .subscribe((result: any) => {
        self.dialogRef = null;
        if (result) {
          //this.fetchMyNotes();
        }
      });
  }

  activateNote(i: number) {
    let index: number = 0;
    this.isUpdateNote = true;
    this.isIconClicked = false;
    for(let note of this.notes) {
      if(i == index) {
        note.isActive = true;
        this.notesForm.controls['editorContent'].setValue(note.description);
        this.notesForm.controls['noteTitle'].setValue(note.title);
      } else {
        note.isActive = false;
      }
      index++;
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    const container = event.container;
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    //this.updateNote(container);
  }

  onUpdateNote() {
    this.isSaving = true;
    for(let note of this.notes) {
      if(note.isActive) {
        this.notesForm.controls['_id'].setValue(note._id);
      }
    }

    this._NotesService.updateNote(this.notesForm.value).subscribe((response: any) => {
      setTimeout(() => {
        if(response) {
          this.activeNoteId = response.data._id
          this.fetchMyNotes(true);
          this.isSaving = false;
        } else {
          this.isSaving = false;
        }
      }, 500)
    });
  }

  addNote() {
    this.notes.push({
      description: this.notesForm.value.item,
      done: false
    })
  }

  onDeleteNote() {
      for(let note of this.notes) {
        if(note.isActive) {
          this.deleteNoteForm.controls['_id'].setValue(note._id);
        }
      }
      this.onRemove();
  }

  onCreateNote() {
      this.isSaving = true;
      const htmlContent = this.notesForm.get('editorContent')?.value; // Extract HTML content
  
      if(this.notesForm.valid) {
        this._NotesService.createNewNote(this.notesForm.value).subscribe({
          next: (response: any) => {
            setTimeout(() => {
              if(response) {
                this.activeNoteId = response.data._id
                this.fetchMyNotes(true);
                this.isSaving = false;
                this.isUpdateNote = true;
                this.isIconClicked = false;
              }
              this.isSaving = false;
            }, 500);
          },
          error: (error: Error) => {
            this.isSaving = false;
          }
        });
      }
  }

  onSave() {
    
  }

  dropdownSelected(menu: string, item: any) {
      document.getElementById(menu)!.innerHTML = item;
  }
}

