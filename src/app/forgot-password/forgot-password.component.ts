import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

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

  constructor(private _authService: AuthService) {

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
      },
      error: (error: Error) => {
        this.response = true;
        this.isUserFound = false;
        this.isLoading = false;
        console.log('error:', error);
      }
    });
  }
}
