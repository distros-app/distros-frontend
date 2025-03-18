import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  email: string = '';
  isUserFound!: boolean;
  isLoading: boolean = false;
  response: boolean = false;
  forgetForm!: FormGroup;
  fb = inject(FormBuilder);
  toastrService = inject(ToastrService);

  constructor(private _authService: AuthService, private _toastr: ToastrService) {

  }

  ngOnInit() {
    this.forgetForm = this.fb.group({
      email:  ['', [Validators.required, Validators.email]]
    })
  }

  onSubmit() {
    this.isLoading = true;
    this._authService.forgotPassword(this.forgetForm.value).subscribe({
      next: (response: any) => {
        this.response = true;
        this.isUserFound = true;
        this.isLoading = false;
        this._toastr.success('Sent! Please check your email', 'Success', {
          toastClass: 'custom-toast',
        });
      },
      error: (error: Error) => {
        this.response = true;
        this.isUserFound = false;
        this.isLoading = false;
        this._toastr.success('No user found with this email', 'Error', {
          toastClass: 'custom-toast-error',
        });
      }
    });
  }
}
