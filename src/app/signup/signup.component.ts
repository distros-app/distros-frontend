import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { v4 as uuidv4 } from 'uuid';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  form: FormGroup
  authService = inject(AuthService);
  router = inject(Router);
  toastrService = inject(ToastrService);
  isLoading: boolean = false;
  userAlreadyExists: boolean = false;
  accountAlreadyExistsOnThisDevice: boolean = false;
  response: boolean = false;
  deviceKey!: any;
    
  constructor(private fb: FormBuilder, private _toastr: ToastrService) {
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
    this.fetchDeviceKey();
  }

  fetchSubscriptionType() {
    const type = 'FREE TRIAL'; //make dynamic later
    this.form.get('subscription.type')?.setValue(type);
  }

  fetchDeviceKey() {
    this.deviceKey = localStorage.getItem('device_key');
  }
  
  async onSignUp() {
    if (this.form.valid) {
      this.isLoading = true;

      if(!this.deviceKey) {
        try {
          // Load FingerprintJS and get device fingerprint
          const fp = await FingerprintJS.load();
          const result = await fp.get();
          const fingerprint = result.visitorId;
  
          // Attach fingerprint to form data
          const formData = { ...this.form.value, fingerprint };
  
          // Send registration requests
          this.authService.register(formData).subscribe({
            next: (response: any) => {
              this.userAlreadyExists = false;
              this.accountAlreadyExistsOnThisDevice = false;
              this._toastr.success('Your account was created successfully. Welcome to Distros!', 'Success', {
                toastClass: 'custom-toast',
              });
              const deviceKey = uuidv4();
              localStorage.setItem('device_key', deviceKey);

              this.isLoading = false;
              this.response = true;
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 1500);
            },
            error: (error: any) => {
              if (error == 'Forbidden') { //Fingerprint error triggered (an account already exists on this device)
                this.isLoading = false;
                this.accountAlreadyExistsOnThisDevice = true;
                this.userAlreadyExists = false;
              } else {
                this.isLoading = false;
                this.response = true;
                this.accountAlreadyExistsOnThisDevice = false;
                this.userAlreadyExists = true;
              }
            }
          });
        } catch (error) {
          this.isLoading = false;
        }
      } else {
        setTimeout(() => {
          this.isLoading = false;
          this.accountAlreadyExistsOnThisDevice = true;
        }, 500)
      }
    }
  }
}
