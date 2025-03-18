import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

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
  token: string | null = null;

  constructor(private _authService: AuthService, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    // Capture token from URL fragment (Hash) using the ActivatedRoute
    this.route.fragment.subscribe(fragment => {
      // Check for a token in the URL fragment
      if (fragment) {
        const params = new URLSearchParams(fragment);
        this.token = params.get('token');
      }
    });

    if (this.token) {
      console.log('Password reset token:', this.token);
    } else {
      console.error('No token found!');
    }

    this.buildForm();
  }

  buildForm() {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    })
  }

  onSubmit() {
    console.log(this.resetForm.value)
    let resetObj = {
      token: this.token,
      password: this.resetForm.value.password
    };

    this._authService.resetPassword(resetObj).subscribe({
      next: (response: any) => {
        console.log(response)
        this.router.navigate(['/login']);
      }
    });
  }
}
