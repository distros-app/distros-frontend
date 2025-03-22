import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { NgIf } from '@angular/common';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  authService = inject(AuthService);
  router = inject(Router);
  isUserNotFound: boolean = false;
  isLoading: boolean = false;
  rememberMe: boolean = false;
  private secretKey = 'your-strong-secret-key';
  

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      rememberMe: new FormControl(false)
    });
  }

  ngOnInit() {
    const savedCredentials = localStorage.getItem('savedCredentials');
    if (savedCredentials) {
      this.rememberMe = true;
      const parsedData = JSON.parse(savedCredentials);
      const decryptedPassword = AES.decrypt(parsedData.password, this.secretKey).toString(Utf8);
      this.form.patchValue({
        email: parsedData.email,
        password: decryptedPassword,
        rememberMe: true // Set 'rememberMe' to true if credentials are found
      });
    }
  }
  
  async onLogin() {
    if(this.form.valid) {
      this.isLoading = true;
      this.authService.login(this.form.value).subscribe({
        next: (response: any) => {
          this.isUserNotFound = false;
          this
          this.isLoading = false;

          // Check if "Remember Me" is checked
          this.form.controls['rememberMe'].setValue(this.rememberMe);
          if (this.form.value.rememberMe) {
            const encryptedPassword = AES.encrypt(this.form.value.password, this.secretKey).toString();
            localStorage.setItem('savedCredentials', JSON.stringify({
              email: this.form.value.email,
              password: encryptedPassword
            }));
          } else {
            localStorage.removeItem('savedCredentials');
          }

          this.router.navigate(['/dashboard']);
        },
        error: (error: Error) => {
          this.isUserNotFound = true;
          this.isLoading = false;
        }
      });
    } else {
      
    }
  }

  clicked() {
    this.rememberMe = !this.rememberMe;
  }
}
