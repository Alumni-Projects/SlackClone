import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  getFirestore,
  onSnapshot,
  updateDoc
} from 'firebase/firestore';
import { firebaseConfig } from '../../../../environments/environment';
import { DevspaceService } from '../devspace-service/devspace.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private app: FirebaseApp;
  public firestore: Firestore;

  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.firestore = getFirestore(this.app);
  }

  async saveUserToFirestore(user: User, profile: string): Promise<void> {
    const userRef = doc(this.firestore, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      console.log('Dokument existiert bereits, keine Änderungen vorgenommen.');
      return;
    }

    const userData = {
      uid: user.uid,
      profile,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(userRef, userData);
      console.log('User data saved to Firestore');
    } catch (error) {
      console.error('Error saving user to Firestore:', error);
      throw error;
    }
  }

  async saveGuestToFirestore(user: User, profile: string): Promise<void> {
    const guestRef = doc(this.firestore, 'guests', user.uid);
    const guestData = {
      uid: user.uid,
      ip: await fetch('https://checkip.amazonaws.com/').then((res) =>
        res.text()
      ),
      profile,
      displayName: `Guest_${user.uid.slice(0, 5)}`,
      isAnonymous: true,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(guestRef, guestData, { merge: true });
      console.log('Guest data saved to Firestore');
    } catch (error) {
      console.error('Error saving guest to Firestore:', error);
      throw error;
    }
  }

  async fetchUserFromFirestore(uid: string): Promise<any> {
    const userRef = doc(this.firestore, 'users', uid);

    try {
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        console.log('User data from Firestore:', userData);
        return userData;
      } else {
        console.log('No user data found in Firestore');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user from Firestore:', error);
      throw error;
    }
  }

  async fetchSecretData(uid: string): Promise<any> {
    const secretRef = doc(this.firestore, `users/${uid}/secretData/secretData`);
    try {
      const secretSnap = await getDoc(secretRef);
      if (secretSnap.exists()) {
        return secretSnap.data();
      } else {
        return null;
      }
    } catch (error) {
      console.error('Fehler beim Abrufen von secretData:', error);
      return null;
    }
  }

  async updateUserInFirestore(
    uid: string,
    updatedData: Partial<any>
  ): Promise<void> {
    const userRef = doc(this.firestore, 'users', uid);

    try {
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        throw new Error(
          'Benutzer nicht gefunden. Erstelle zuerst ein Dokument mit saveUserToFirestore.'
        );
      }

      await updateDoc(userRef, updatedData);
      console.log('User data updated in Firestore:', updatedData);
    } catch (error) {
      console.error('Error updating user in Firestore:', error);
      throw error;
    }
  }

  async initUser(devspaceService: DevspaceService): Promise<void> {
    const auth = getAuth();

    onAuthStateChanged(auth, async (user) => {
      console.log('Firebase User erkannt:', user);

      if (!user) {
        console.warn('Kein Benutzer eingeloggt.');
        return;
      }

      const userRef = doc(this.firestore, 'users', user.uid);
      const fallbackGuestRef = doc(this.firestore, 'guests', user.uid);

      onSnapshot(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.data() as any;
          devspaceService.setActiveUser(userData);
          console.log('Realtime update user:', userData.displayName);
        } else if (user.isAnonymous) {
          onSnapshot(fallbackGuestRef, (guestSnap) => {
            if (guestSnap.exists()) {
              const guestData = guestSnap.data() as any;
              devspaceService.setActiveUser(guestData);
              console.log('Realtime update guest:', guestData.displayName);
            } else {
              console.warn('Kein Datensatz gefunden – auch nicht als Gast.');
            }
          });
        } else {
          console.warn('Kein Benutzerdatensatz gefunden.');
        }
      });
    });
  }
}
