import { Component, ViewChild } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { OverlayComponent } from '@components/overlay/overlay.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '@shared/services/auth-service/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, ReactiveFormsModule, MatDividerModule, MatIconModule, OverlayComponent, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../send-email/send-email.component.scss']
})
export class RegisterComponent {
  @ViewChild(OverlayComponent) overlayRef!: OverlayComponent;
  isChecked = false;
  continue = false;
  selectedAvatar = 'avatar0.svg';

  errorMessage: any = null

  avatars: string[]

  registerForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
      this.usernameValidator()
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  usernameValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const username = control.value;

      if (!username) {
        return null;
      }

      const usernameSplit = username.split(' ');

      if (!usernameSplit[1] || usernameSplit[1].length === 0) {
        return { incorrect: true };
      }

      const hasSpecialChars = /[^a-zA-ZäöüÄÖÜß\s\p{L}]/u.test(username);
      if (hasSpecialChars) {
        return { special: true };
      }

      return null;
    };
  }

  get usernameFormControl() {
    return this.registerForm.get('username') as FormControl;
  }
  get emailFormControl() {
    return this.registerForm.get('email') as FormControl;
  }

  get passwordFormControl() {
    return this.registerForm.get('password') as FormControl;
  }

  constructor(private router: Router, private authService: AuthService) {
    this.avatars = this.authService.avatars;
  }

  backToLogin() {
    if (!this.continue) {
      this.router.navigate(['/login']);
    } else {
      this.continue = !this.continue;
    }

  }

  clickContinue() {
    this.continue = true;
  }

  async createUser() {
    try {
      await this.authService.registerWithEmail(this.emailFormControl.value!, this.passwordFormControl.value!, this.usernameFormControl.value!, this.selectedAvatar);
      this.openOverlay();
      this.errorMessage = null;
    } catch (error) {
      this.errorMessage = error;
    }

  }

  openOverlay() {
    if (this.overlayRef) {
      this.overlayRef.triggerAnimation(true);
    }
  }

  toggleCheckbox() {
    this.isChecked = !this.isChecked;
  }

  selectAvatar(avatar: string) {
    this.selectedAvatar = avatar;
  }

}
