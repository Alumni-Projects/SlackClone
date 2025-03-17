import { Injectable } from '@angular/core';
import { Auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signInAnonymously, signOut, User, sendEmailVerification, updateProfile, sendPasswordResetEmail, updateEmail, onAuthStateChanged, confirmPasswordReset, verifyPasswordResetCode, getAdditionalUserInfo, applyActionCode, reload } from 'firebase/auth';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { FirestoreService } from '../firestore-service/firestore.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private app: FirebaseApp;
  public auth: Auth;
  public user: User | null = null;

  public avatars = [
    'avatar1.svg',
    'avatar2.svg',
    'avatar3.svg',
    'avatar4.svg',
    'avatar5.svg',
    'avatar6.svg',
  ]

  constructor(private router: Router, private firestoreService: FirestoreService) {
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
      if (user) {
        if (user.isAnonymous) {
          this.router.navigate(['/dashboard']);
        } else if (user.emailVerified) {
          this.firestoreService.fetchUserFromFirestore(user.uid).then(userData => {
            console.log('User data loaded:', userData);
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
        const profile = this.avatars[Math.floor(Math.random() * this.avatars.length)];
        await this.firestoreService.saveUserToFirestore(user, profile);
        this.router.navigate(['/dashboard']);
        return;
      }

      if (!user.emailVerified) {
        throw new Error('E-Mail nicht verifiziert.');
      }
    } catch (error) {
      console.error('Google login error: ', error);
      throw error;
    }
  }

  async loginAsGuest(): Promise<void> {
    try {
      const userCredential = await signInAnonymously(this.auth);
      const user = userCredential.user;
      const profile = this.avatars[Math.floor(Math.random() * this.avatars.length)];
      await this.firestoreService.saveGuestToFirestore(user, profile);
      console.log('Logged in as guest:', user.uid);
    } catch (error) {
      console.error('Guest login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.router.navigate(['/login']);
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
