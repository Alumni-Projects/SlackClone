import { Component } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { AuthService } from '@shared/services/auth-service/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, MatDividerModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);

  emailLoginError: any = null;
  googleLoginError: any = null;

  constructor(private router: Router, private authService: AuthService) { }

  navigateTo(target: string) {
    this.router.navigate(['/' + target]);
  }

  async signIn() {
    try {
      await this.authService.loginWithEmail(this.emailFormControl.value!, this.passwordFormControl.value!);
      this.emailLoginError = null;
    } catch (error) {
      console.error('Login error: ', error);
      this.emailLoginError = error;
    }
  }

  async signInWithGoogle() {
    try {
      await this.authService.loginWithGoogle();
      this.googleLoginError = null;
    } catch (error) {
      console.error('Google login error: ', error);
      this.googleLoginError = error;
    }
  }

  async loginAsGuest() {
    try {
      await this.authService.loginAsGuest();
      this.emailLoginError = null;
    } catch (error: any) {
      console.error('Guest login error:', error);
      this.emailLoginError = error.message || 'Gast-Login fehlgeschlagen.';
    }
  }
}
