import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { User } from 'firebase/auth';
import { Firestore, doc, setDoc, getDoc, getFirestore, updateDoc, collection, getDocs, query, where, onSnapshot, addDoc, deleteDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
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
  lastAddedChannel: Devspace | null = null;

  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.firestore = getFirestore(this.app);
  }

  async saveUserToFirestore(user: User, profile: string): Promise<void> {
    const userRef = doc(this.firestore, 'users', user.uid);

    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      console.log('Document already exists, no changes made.');
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
        throw new Error('User not found. First create a document with saveUserToFirestore.');
      }

      await updateDoc(userRef, updatedData);
      console.log('User data updated in Firestore:', updatedData);
    } catch (error) {
      console.error('Error updating user in Firestore:', error);
      throw error;
    }
  }

  async fetchUserFromFirestoreAll(): Promise<any> {
    const userRef = collection(this.firestore, 'users');
    try {
      const querySnapshot = await getDocs(userRef);
      const users = querySnapshot.docs.map(doc => ({
        ...doc.data()
      }));
      
      return users;
    } catch (error) {
      console.error('Error fetching users from Firestore:', error);
      throw error;
    }
  }

  async saveChannelToFirestore(channel: Devspace): Promise<void> {
    const channelCollectionRef = collection(this.firestore, 'channel');
    try {
      await addDoc(channelCollectionRef, channel);      
    } catch (error) {
      
      throw error;
    }
  }

  async updateChannelEditInFirestore(uid: string, updatedData: Partial<any>): Promise<void> {
    const channelRef = doc(this.firestore, 'channel', uid);
    try {
      const userSnap = await getDoc(channelRef);
      if (!userSnap.exists()) {
        throw new Error('User not found. First create a document with saveUserToFirestore.');
      }
      await updateDoc(channelRef, updatedData);
      console.log('User data updated in Firestore:', updatedData);
    } catch (error) {
      console.error('Error updating user in Firestore:', error);
      throw error;
    }
  }

  subscribeToUserChannels(userId: string): void {    
    const channelsRef = collection(this.firestore, 'channel');
    const q = query(channelsRef, where('member', 'array-contains', userId));
    onSnapshot(q, (querySnapshot) => {
      const channels = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Devspace));
      console.log('loading Channels:', channels);
      this.channelsSubject.next(channels);
      querySnapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          this.lastAddedChannel = { id: change.doc.id, ...change.doc.data() } as Devspace;
        }
      });
    }, (error) => {      
      this.channelsSubject.next([]);
    });
  }

  async deleteChannelFromFirestore(channeluid: string): Promise<void> {
    const channelRef = doc(this.firestore, 'channel', channeluid);
    try {
      const channelSnap = await getDoc(channelRef);
      if (!channelSnap.exists()) {
        throw new Error('Channel not found.');
      }
      await deleteDoc(channelRef);      
    } catch (error) {
      console.error('error with deleting Channels in Firestore:', error);
      throw error;
    }
  }

  async deleteChannelMemberFromFirestore(channelId: string, userId: string): Promise<void> {
    const channelRef = doc(this.firestore, 'channel', channelId);

    try {
      await updateDoc(channelRef, {
        member: arrayRemove(userId)
      });
      
    } catch (error) {
      console.error('error with removing the Users from the Channel:', error);
      throw error;
    }
  }

  async newChannelMemberToFirestore(channelId: string, userId: string | null): Promise<void> {
    const channelRef = doc(this.firestore, 'channel', channelId);
    try {
      await updateDoc(channelRef, {
        member: arrayUnion(userId)
      });
      console.log(`User ${userId} successfully added to channel ${channelId}.`);
    } catch (error) {
      console.error('Error when adding the user to the channel:', error);
      throw error;
    }
  }
}
