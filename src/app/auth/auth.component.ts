import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RegisterUser } from '../models/auth/registerUser';

@Component({
  selector: 'auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {
  activeTab: string = 'login';
  registerForm!: FormGroup;
  loginForm!: FormGroup;
  isSubmitting = false;
  errorMessage = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService) {
    this.route.queryParams.subscribe(params => {
      this.activeTab = params['tab'] || 'login';
    });
  }

  ngOnInit(): void {

    this.initializeRegisterForm();
    this.initializeLoginForm();
  }

  initializeRegisterForm(): void {
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  initializeLoginForm(): void {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onRegisterSubmit() {
    if (this.registerForm.valid) {
      this.isSubmitting = true;
      const newRegisterUser: RegisterUser = this.registerForm.value;
      this.authService.register(newRegisterUser).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['home']);
        },
        error: (error: any) => {
          this.isSubmitting = false;
          console.error('Kayıt oluşturulurken bir hata oluştu:', error);
        }
      });
    }
  }



  onLoginSubmit() {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.authService.login(this.loginForm.value).subscribe(
        {
          next: success => {
            if (success) {
              this.isSubmitting = false;
              this.router.navigate(['home']);
            } else {
              this.isSubmitting = false;
              this.errorMessage = 'Authentication failed. Please try again.';
            }
          },
          error: err => {
            this.isSubmitting = false;
            this.errorMessage = 'An error occurred. Please try again.';
          }
        }
      );
    }
  }
}