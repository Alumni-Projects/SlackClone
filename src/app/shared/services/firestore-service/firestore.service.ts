import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { User } from 'firebase/auth';
import { Firestore, doc, setDoc, getDoc, getFirestore, updateDoc, collection, getDocs, query, where, onSnapshot, addDoc  } from 'firebase/firestore';
import { firebaseConfig } from '../../../../environments/environment';
import { Devspace } from '@shared/interface/devspace';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private app: FirebaseApp;
  public firestore: Firestore;
  private channelsSubject = new BehaviorSubject<Devspace[]>([]);
  channels$ = this.channelsSubject.asObservable();

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

  // test firestore user holen Alex!

  
  async fetchUserFromFirestoreAll(): Promise<any> {
    const userRef = collection(this.firestore, 'users'); // Verweise auf die Collection
    try {
      const querySnapshot = await getDocs(userRef);
      const users = querySnapshot.docs.map(doc => ({        
        ...doc.data() // User-Daten hinzufügen
      }));
  
      console.log('All users from Firestore:', users);
      return users;
    } catch (error) {
      console.error('Error fetching users from Firestore:', error);
      throw error;
    }
  }

  // async getUserChannels(userId: string): Promise<Devspace[]> {
  //   try {
  //     const db = this.firestore; 
  //     const channelsRef = collection(db, 'channel'); 
  //     const q = query(channelsRef, where('member', 'array-contains', userId));  
  //     const querySnapshot = await getDocs(q);  
  //     return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //   } catch (error) {
  //     console.error('Fehler beim Abrufen der Channels:', error);
  //     return [];
  //   }
  // }

  async saveChannelToFirestore(channel: Devspace): Promise<void> {
    const channelCollectionRef = collection(this.firestore, 'channel'); // Referenz zur Sammlung
    
    try {
      await addDoc(channelCollectionRef, channel); // Fügt ein neues Dokument mit Auto-ID hinzu
      console.log('Channel erfolgreich gespeichert.');
    } catch (error) {
      console.error('Fehler beim Speichern des Channels:', error);
      throw error;
    }
  }

  async updateChannelEditInFirestore(uid: string, updatedData: Partial<any>): Promise<void> {
    const channelRef = doc(this.firestore, 'channel', uid);

    try {
      const userSnap = await getDoc(channelRef);
      if (!userSnap.exists()) {
        throw new Error('Benutzer nicht gefunden. Erstelle zuerst ein Dokument mit saveUserToFirestore.');
      }

      await updateDoc(channelRef, updatedData);
      console.log('User data updated in Firestore:', updatedData);
    } catch (error) {
      console.error('Error updating user in Firestore:', error);
      throw error;
    }
  }

  

  subscribeToUserChannels(userId: string): void {
    console.log('Firestore Listener gestartet für User:', userId);
    const channelsRef = collection(this.firestore, 'channel');
    const q = query(channelsRef, where('member', 'array-contains', userId));
  
    onSnapshot(q, (querySnapshot) => {
      const channels = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Devspace));
      console.log('Empfangene Channels:', channels);
      this.channelsSubject.next(channels);
    }, (error) => {
      console.error('Fehler beim Abhören der Channels:', error);
      this.channelsSubject.next([]);
    });
  }
  
}
