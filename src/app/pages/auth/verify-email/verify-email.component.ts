import { Component, OnInit } from '@angular/core';
import { AuthService } from '@shared/services/auth-service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  imports: [],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent implements OnInit {

  oobCode: string | null = null;
  verified = false;
  isLoggedIn = false

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {
    const user = this.authService.getUser()
    if (user) {
      this.isLoggedIn = true;
    }
  }

  resendVerification() {
    this.authService.sendVerification();
  }

  ngOnInit() {
    this.oobCode = this.route.snapshot.queryParams['oobCode'];
    if (this.oobCode) {
      this.verifyCode();
    }
    const user = this.authService.getUser();
    if (user?.emailVerified) {
      this.verified = user.emailVerified;
    }
  }

  async verifyCode() {
    try {
      await this.authService.verifyPasswordResetCode(this.oobCode!);
      await this.authService.verifyEmailWithCode(this.oobCode!);
      this.verified = true;
    } catch (error) {
      console.error('Error verifying reset code:', error);
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
  }

}
