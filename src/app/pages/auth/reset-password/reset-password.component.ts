import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { OverlayComponent } from "../../../components/overlay/overlay.component";
import { AuthService } from '../../../shared/services/auth-service/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, MatIconModule, ReactiveFormsModule, OverlayComponent],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss', '../send-email/send-email.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  @ViewChild(OverlayComponent) overlayRef!: OverlayComponent;
  oobCode: string | null = null;
  passwordForm = new FormGroup(
    {
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required])
    },
    {
      validators: (control: AbstractControl): ValidationErrors | null => {
        const form = control as FormGroup;
        const password = form.get('password')?.value;
        const confirmPassword = form.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { mismatch: true };
      }
    }
  );

  get passwordFormControl() {
    return this.passwordForm.get('password') as FormControl;
  }

  get confirmPasswordFormControl() {
    return this.passwordForm.get('confirmPassword') as FormControl;
  }

  constructor(private router: Router, private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.oobCode = this.route.snapshot.queryParams['oobCode'];
    if (this.oobCode) {
      this.verifyCode();
    }
  }

  async verifyCode() {
    try {
      await this.authService.verifyPasswordResetCode(this.oobCode!);
    } catch (error) {
      console.error('Error verifying reset code:', error);
    }
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }

  async resetPassword() {
    if (this.passwordForm.invalid || !this.oobCode) return;

    try {
      await this.authService.confirmPasswordReset(this.oobCode, this.passwordFormControl.value!);
      this.openOverlay();
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  }

  openOverlay() {
    if (this.overlayRef) {
      this.overlayRef.triggerAnimation();
    }
  }

}
