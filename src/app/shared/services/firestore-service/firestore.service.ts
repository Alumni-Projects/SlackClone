import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { User } from 'firebase/auth';
import { Firestore, doc, setDoc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { firebaseConfig } from '../../../../environments/environment';

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
      profile: profile,
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
      ip: await fetch("https://checkip.amazonaws.com/").then(res => res.text()),
      profile: profile,
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

  async updateUserInFirestore(uid: string, updatedData: Partial<any>): Promise<void> {
    const userRef = doc(this.firestore, 'users', uid);

    try {
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        throw new Error('Benutzer nicht gefunden. Erstelle zuerst ein Dokument mit saveUserToFirestore.');
      }

      await updateDoc(userRef, updatedData);
      console.log('User data updated in Firestore:', updatedData);
    } catch (error) {
      console.error('Error updating user in Firestore:', error);
      throw error;
    }
  }
}
