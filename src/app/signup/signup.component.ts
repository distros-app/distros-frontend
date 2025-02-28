import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  form: FormGroup
  authService = inject(AuthService);
  router = inject(Router);
  isLoading: boolean = false;
  userAlreadyExists: boolean = false;
  response: boolean = false;
    
  constructor(private fb: FormBuilder) {
      this.form = this.fb.group({
        name: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required]),
        subscription: new FormGroup({
          type: new FormControl(''),
          //isActive:  new FormControl('')
        }),
        referralCode: new FormControl('', [])
      })
  }

  ngOnInit() {
    this.fetchSubscriptionType();
  }

  fetchSubscriptionType() {
    const type = 'FREE TRIAL'; //make dynamic later
    this.form.get('subscription.type')?.setValue(type);
  }
  
  onSignUp() {
    if(this.form.valid) {
      this.isLoading = true;

      this.authService.register(this.form.value).subscribe({
        next: (response: any) => {
          this.userAlreadyExists = false;
          this.isLoading = false;
          this.response = true;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500)
        },
        error: (error: Error) => {
          this.userAlreadyExists = true;
          this.isLoading = false;
          this.response = true;
        }
      });
    }
  }
}
