import { Injectable } from '@angular/core';
import { Auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signInAnonymously, signOut, User, sendEmailVerification, updateProfile, sendPasswordResetEmail, updateEmail, onAuthStateChanged, confirmPasswordReset, verifyPasswordResetCode, getAdditionalUserInfo, applyActionCode, reload } from 'firebase/auth';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { FirestoreService } from '../firestore-service/firestore.service';
import { BehaviorSubject } from 'rxjs';
import { DevspaceService } from '../devspace-service/devspace.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private app: FirebaseApp;
  public auth: Auth;
  public user: User | null = null;
  public userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  public avatars = [
    'assets/avatar/avatar1.svg',
    'assets/avatar/avatar2.svg',
    'assets/avatar/avatar3.svg',
    'assets/avatar/avatar4.svg',
    'assets/avatar/avatar5.svg',
    'assets/avatar/avatar6.svg',
  ]

  constructor(private router: Router, private firestoreService: FirestoreService, public devspaceService: DevspaceService) {
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
      this.userSubject.next(user);
      if (user) {
        if (user.emailVerified) {
          this.firestoreService.fetchUserFromFirestore(user.uid).then(userData => {
            this.router.navigate(['/dashboard']);
          });
        }
      }
    });
  }

  async registerWithEmail(email: string, password: string, displayName: string, profile: string): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName });
      await this.sendVerification();
      this.firestoreService.saveUserToFirestore(user, profile);
    } catch (error: any) {
      console.error('Registration error: ', error);
      switch (error.code) {
        case 'auth/email-already-in-use':
          return Promise.reject('Dieser Benutzer existiert bereits.');
        default:
          return Promise.reject('Ein unbekannter Fehler ist aufgetreten. Versuche es später erneut.');
      }
    }
  }

  async loginWithEmail(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        this.router.navigate(['/verify-email']);
        return Promise.reject('E-Mail nicht verifiziert. Bitte überprüfe deine E-Mail.');
      }
    } catch (error: any) {
      console.error('Login error: ', error);

      switch (error.code) {
        case 'auth/invalid-credential':
          return Promise.reject('Ungültige Anmeldeinformationen. Überprüfe E-Mail und Passwort.');
        case 'auth/too-many-requests':
          return Promise.reject('Zu viele fehlerhafte Versuche. Bitte warte einen Moment.');
        case 'auth/user-disabled':
          return Promise.reject('Der Benutzer wurde blockiert.');
        default:
          return Promise.reject('Ein unbekannter Fehler ist aufgetreten. Versuche es später erneut.');
      }
    }
  }

  async loginWithGoogle(): Promise<void> {
    try {
      const userCredential = await signInWithPopup(this.auth, new GoogleAuthProvider());
      const user = userCredential.user;
      const additionalUserInfo = getAdditionalUserInfo(userCredential);
      if (additionalUserInfo?.isNewUser) {
        const profile = (additionalUserInfo!.profile as { picture: string }).picture;
        await this.firestoreService.saveUserToFirestore(user, profile);
        this.router.navigate(['/dashboard']);
        return;
      }

    } catch (error: any) {
      console.error('Google login error: ', error);
      switch (error.code) {
        case 'auth/too-many-requests':
          return Promise.reject('Zu viele fehlerhafte Versuche. Bitte warte einen Moment.');
        case 'auth/user-disabled':
          return Promise.reject('Der Benutzer wurde blockiert.');
        default:
          return Promise.reject('Ein unbekannter Fehler ist aufgetreten. Versuche es später erneut.');
      }
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.userSubject.next(null);
    this.user = null;
    this.router.navigate(['/login']);
    this.deleteArraysLogout();
    this.closeAllMenus();
  }

  deleteArraysLogout() {
    this.devspaceService.accounts = [];
    this.devspaceService.dmAccounts = [];
  }

  closeAllMenus() {
    this.devspaceService.openMessage = false;
    this.devspaceService.openChannel = false;
    this.devspaceService.openThread = false;
    this.devspaceService.openDirectMessage = false;
    this.devspaceService.activeDMContact = null;
    this.devspaceService.selectedChannelId = '';
  }

  async sendVerification(): Promise<void> {
    const user = this.getUser();
    if (user) {
      await sendEmailVerification(user);
      console.log('Verification email sent.');
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      console.log('Password reset email sent');
    } catch (error) {
      console.error('Error sending password reset email', error);
    }
  }

  async updateEmail(newEmail: string): Promise<void> {
    const user = this.getUser();
    if (!user) {
      throw new Error('No user logged in');
    }
    try {
      await updateEmail(user, newEmail);
      console.log('Email updated successfully');
    } catch (error) {
      console.error('Error updating email', error);
      throw error;
    }
  }

  async verifyPasswordResetCode(oobCode: string): Promise<void> {
    try {
      await verifyPasswordResetCode(this.auth, oobCode);
      console.log('Reset code verified');
    } catch (error) {
      console.error('Error verifying reset code:', error);
      throw error;
    }
  }

  async confirmPasswordReset(oobCode: string, newPassword: string): Promise<void> {
    try {
      await confirmPasswordReset(this.auth, oobCode, newPassword);
      console.log('Password reset confirmed');
    } catch (error) {
      console.error('Error confirming password reset:', error);
      throw error;
    }
  }

  async verifyEmailWithCode(oobCode: string): Promise<void> {
    try {
      await applyActionCode(this.auth, oobCode);
      console.log('E-Mail erfolgreich verifiziert.');
      const user = this.getUser();
      if (user) {
        await this.firestoreService.updateUserInFirestore(user.uid, { emailVerified: true });
        await reload(user!);
        this.router.navigate(['/dashboard']);
      }
    } catch (error: any) {
      console.error('Error verifying email: ', error);
      throw error;
    }
  }

  getUser(): User | null {
    return this.auth.currentUser;
  }

  isAlreadyAnonymouslyLoggedIn(): boolean {
    return localStorage.getItem('anonymousUserId') !== null;
  }

  setAnonymousLoginFlag(userId: string): void {
    localStorage.setItem('anonymousUserId', userId);
  }
}
