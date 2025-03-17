import { Component, ViewChild } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { OverlayComponent } from "@components/overlay/overlay.component";
import { AuthService } from '@shared/services/auth-service/auth.service';

@Component({
  selector: 'app-send-email',
  imports: [FormsModule, MatIconModule, ReactiveFormsModule, OverlayComponent],
  templateUrl: './send-email.component.html',
  styleUrl: './send-email.component.scss'
})
export class SendEmailComponent {
  @ViewChild(OverlayComponent) overlayRef!: OverlayComponent;
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  constructor(private router: Router, private authService: AuthService) { }

  backToLogin() {
    this.router.navigate(['/login']);
  }

  sendMail() {
    this.authService.resetPassword(this.emailFormControl.value!);
    this.openOverlay();
  }

  openOverlay() {
    if (this.overlayRef) {
      this.overlayRef.triggerAnimation();
    }
  }

}
