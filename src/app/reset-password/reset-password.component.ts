import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  fb = inject(FormBuilder);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  token!: string;
  isLoading: boolean = false;
  toastrService = inject(ToastrService);

  constructor(private _authService: AuthService, private _toastr: ToastrService) {

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(val => {
      this.token = val['token'];
    });
    this.buildForm();
  }

  buildForm() {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    })
  }

  onSubmit() {
    this.isLoading = true;
    let resetObj = {
      token: this.token,
      password: this.resetForm.value.password
    };

    this._authService.resetPassword(resetObj).subscribe({
      next: (response: any) => {
        console.log(response)
        this.isLoading = false;
        this._toastr.success('Password was reset successfully!', 'Success', {
          toastClass: 'custom-toast',
        });
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500)
      }
    });
  }
}
