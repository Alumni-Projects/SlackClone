import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-action',
  template: '<p>Weiterleitung...</p>'
})
export class ActionComponent {
  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    const action = this.route.snapshot.queryParams['mode'];
    if (action === 'resetPassword') {
      this.router.navigate(['/reset-password'], { queryParams: this.route.snapshot.queryParams });
    } else if (action === 'verifyEmail') {
      this.router.navigate(['/verify-email'], { queryParams: this.route.snapshot.queryParams });
    } else {
      this.router.navigate(['/login']);
    }
  }

}
