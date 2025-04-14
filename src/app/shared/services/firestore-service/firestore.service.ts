import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { DevspaceService } from '../devspace-service/devspace.service';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  getFirestore,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  arrayRemove,
  arrayUnion,
  serverTimestamp
} from 'firebase/firestore';
import { firebaseConfig } from '../../../../environments/environment';
import { Devspace } from '@shared/interface/devspace';
import { BehaviorSubject } from 'rxjs';
import { ChatMessage } from '@shared/interface/chat-message';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private app: FirebaseApp;
  public firestore: Firestore;
  private channelsSubject = new BehaviorSubject<Devspace[]>([]);
  channels$ = this.channelsSubject.asObservable();
  lastAddedChannel: Devspace | null = null;
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  messages$ = this.messagesSubject.asObservable();

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

      onSnapshot(userRef, async (snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.data() as any;

          if (!userData.email && user.email) {
            await updateDoc(userRef, { email: user.email });
            userData.email = user.email;
          }

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

  async fetchUserFromFirestoreAll(): Promise<any> {
    const userRef = collection(this.firestore, 'users');
    try {
      const querySnapshot = await getDocs(userRef);
      const users = querySnapshot.docs.map((doc) => ({
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

  async updateChannelEditInFirestore(
    uid: string,
    updatedData: Partial<any>
  ): Promise<void> {
    const channelRef = doc(this.firestore, 'channel', uid);
    try {
      const userSnap = await getDoc(channelRef);
      if (!userSnap.exists()) {
        throw new Error(
          'User not found. First create a document with saveUserToFirestore.'
        );
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
    onSnapshot(
      q,
      (querySnapshot) => {
        const channels = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Devspace)
        );
        console.log('loading Channels:', channels);
        this.channelsSubject.next(channels);
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            this.lastAddedChannel = {
              id: change.doc.id,
              ...change.doc.data()
            } as Devspace;
          }
        });
      },
      (error) => {
        this.channelsSubject.next([]);
      }
    );
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

  async changeChannelMembers(
    channelId: string,
    userId: string,
    memberChange: boolean
  ): Promise<void> {
    const channelRef = doc(this.firestore, 'channel', channelId);
    try {
      if (memberChange) {
        await updateDoc(channelRef, {
          member: arrayUnion(userId)
        });
      } else {
        await updateDoc(channelRef, {
          member: arrayRemove(userId)
        });
      }

      console.log(`member change added or quit channel.`);
    } catch (error) {
      console.error('Error when adding the user to the channel:', error);
      throw error;
    }
  }
  subscribeToMessages(channelId: string): void {
    const messagesRef = collection(
      this.firestore,
      `channel/${channelId}/messages`
    );
    onSnapshot(messagesRef, (querySnapshot) => {
      const messages = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as ChatMessage)
      );
      console.log('Messages loaded:', messages);
      this.messagesSubject.next(messages);
    });
  }

  async addMessageToChannel(
    channelId: string,
    message: string,
    creatorId: string
  ): Promise<void> {
    const messagesRef = collection(
      this.firestore,
      `channel/${channelId}/messages`
    );
    try {
      await addDoc(messagesRef, {
        message,
        creator: creatorId,
        createdAt: serverTimestamp(),
        isThread: false,
        reactions: []
      });
      console.log('Message added to channel');
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }
}
