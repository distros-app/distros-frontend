import { NgIf } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  form!: FormGroup;
  userImage: Array<any> = [];
  authService = inject(AuthService);
  router = inject(Router);
  isLoading: boolean = false;
  profileForm!: FormGroup;
  fb = inject(FormBuilder);
  imageUrl: string | ArrayBuffer | null = null;
  user: any;
  selectedFile: any;
  uploadedImageUrl: any;
  uploadedImagePublicId!: string;
  isPasswordsMatching: boolean = true;
  cloudinaryPreset = 'avatar';
  
  constructor() {

  }

  ngOnInit() {
    this.me();
  }

  buildForm() {
    this.profileForm = this.fb.group({
      name: [this.user.name, [Validators.required]],
      email: [this.user.email, [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
    this.profileForm.controls['password'].valueChanges.subscribe(() => {
      this.isBothPasswordsMatching();
    });
    this.profileForm.controls['confirmPassword'].valueChanges.subscribe(() => {
      this.isBothPasswordsMatching();
    });
  }

  me() {
    this.authService.me().subscribe({
      next: (response: any) => {
        this.user = response.data;
        if(this.user.avatar) this.uploadedImageUrl = this.user.avatar;
        console.log(this.user)
        this.buildForm();
      }, error: (error: any) => {

      }
    })
  }

  onSave() {
    this.isLoading = true;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    console.log('selectedFile:', this.selectedFile)
    if(this.selectedFile) this.onUpload();
  }

  async onDeleteCloudinaryImage() {
    if (!this.uploadedImagePublicId) return;
    
    const cloudinaryDeleteUrl = `https://api.cloudinary.com/v1_1/dza3ed8yw/delete_by_token`;
    
    const body = JSON.stringify({ token: this.uploadedImagePublicId });

    const res = await fetch(cloudinaryDeleteUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
    });

    const response = await res.json();
    console.log('Delete Response:', response);
}

  async onUpload() {
    const formData = new FormData();
    formData.append('file', this.selectedFile/*, this.selectedFile.name*/);
    formData.append('upload_preset', this.cloudinaryPreset);
    formData.append('cloud_name', 'dza3ed8yw');
    //formData.append('folder', 'your_folder_name'); // Optional: Organize files in Cloudinary
    formData.append('width', '125');  // Set width
    formData.append('height', '125'); // Set height
    formData.append('crop', 'fill');  // Crop method to ensure it fills the dimensions

    const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dza3ed8yw/image/upload';
     // Send the file to Cloudinary
     console.log('formData:', formData)
     const res = await fetch(cloudinaryUrl, {method: 'POST', body: formData});
     const cloudinaryImageUrl = await res.json();
     this.uploadedImageUrl = cloudinaryImageUrl.secure_url.replace('/upload/', '/upload/w_125,h_125,c_fill/');
     this.uploadedImagePublicId = cloudinaryImageUrl.public_id;
     console.log('uploadedImageURL:', this.uploadedImageUrl);
  }

  isBothPasswordsMatching() {
    if(this.profileForm.controls['password'].dirty && this.profileForm.controls['confirmPassword'].dirty && 
      this.profileForm.controls['password'].value != this.profileForm.controls['confirmPassword'].value) {
        this.isPasswordsMatching = false;
   } else {
     this.isPasswordsMatching = true;
   }
  }

  onUpdate() {
    let query: Object = { userId: this.user._id, avatar: this.uploadedImageUrl };
    this.authService.updateAvatar(query).subscribe({
      next: (response: any) => {
        this.user = response.data;
        this.buildForm();
      }, error: (error: any) => {

      }
    })
  }

  onCancel() {
    console.log(this.selectedFile)
    if(this.selectedFile) {
      this.uploadedImageUrl = false;
      this.onDeleteCloudinaryImage();
    }
    this.profileForm.controls['password'].setValue('');
    this.profileForm.controls['confirmPassword'].setValue('');
  }
}
