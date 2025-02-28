import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  authService = inject(AuthService);
  router = inject(Router);
  isUserNotFound: boolean = false;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }
  
  async onLogin() {
    this.isLoading = true;

    if(this.form.valid) {
      this.authService.login(this.form.value).subscribe({
        next: (response: any) => {
          this.isUserNotFound = false;
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error: Error) => {
          this.isUserNotFound = true;
          this.isLoading = false;
        }
      });
    }
  }
}
