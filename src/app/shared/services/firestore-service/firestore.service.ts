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
        return userData;
      } else {
        return null;
      }
    } catch (error) {
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
        throw new Error('User does not exist in Firestore. Cannot update.');
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
      if (!user) {
        return;
      }

      const userRef = doc(this.firestore, 'users', user.uid);
      const fallbackGuestRef = doc(this.firestore, 'guests', user.uid);

      onSnapshot(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.data() as any;
          devspaceService.setActiveUser(userData);
        } else if (user.isAnonymous) {
          onSnapshot(fallbackGuestRef, (guestSnap) => {
            if (guestSnap.exists()) {
              const guestData = guestSnap.data() as any;
              devspaceService.setActiveUser(guestData);
            }
          });
        }
      });
    });
  }
}
