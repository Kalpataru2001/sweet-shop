import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  errorMessage = '';

  async onSubmit() {
    if (this.loginForm.invalid) return;

    try {
      const { email, password } = this.loginForm.value;
      await this.authService.login(email!, password!);
      
      // If successful, go to Admin Dashboard
      this.router.navigate(['/admin']);
      
    } catch (err: any) {
      this.errorMessage = 'Invalid Email or Password';
    }
  }
}
