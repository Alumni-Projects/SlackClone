import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { SendEmailComponent } from './pages/auth/send-email/send-email.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { VerifyEmailComponent } from './pages/auth/verify-email/verify-email.component';
import { verifyGuard } from './shared/services/guards/verify/verify.guard';
import { authGuard } from './shared/services/guards/auth/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ActionComponent } from './pages/action/action.component';
import { actionGuard } from './shared/services/guards/action/action.guard';

export const routes: Routes = [
    {
        path: '', redirectTo: '/login', pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'send-email',
        component: SendEmailComponent
    },
    {
        path: 'reset-password',
        component: ResetPasswordComponent,
        canActivate: [actionGuard]
    },
    {
        path: 'signup',
        component: RegisterComponent
    },
    {
        path: 'verify-email',
        component: VerifyEmailComponent,
        // canActivate: [verifyGuard]
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard]
    },
    {
        path: 'action',
        component: ActionComponent
    },
    {
        path: '**',
        component: NotFoundComponent
    },

];
