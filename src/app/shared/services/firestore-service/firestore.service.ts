import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { User } from 'firebase/auth';
import { Firestore, doc, setDoc, getDoc, getFirestore, updateDoc, collection, getDocs, query, where, onSnapshot, addDoc, deleteDoc, arrayRemove, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { firebaseConfig } from '../../../../environments/environment';
import { Devspace } from '@shared/interface/devspace';
import { BehaviorSubject } from 'rxjs';
import { ChatMessage } from '@shared/interface/chat-message';
import { ChatReaction } from '@shared/interface/chat-reactions';

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

  async changeChannelMembers(channelId: string, userId: string, memberChange: boolean): Promise<void> {
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
    const messagesRef = collection(this.firestore, `channel/${channelId}/messages`);
    onSnapshot(messagesRef, async (querySnapshot) => {
      if (querySnapshot.empty) {
        console.log('No messages found');
        this.messagesSubject.next([]);
        return;
      }
      const messages: ChatMessage[] = [];
      for (const doc of querySnapshot.docs) {
        const message = { id: doc.id, ...doc.data(), creator: doc.data()['creator'] } as ChatMessage;
        const creatorData = await this.getUserData(message.creator);
        message.creatorData = creatorData;        
        messages.push(message);
      }
      messages.sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
      console.log('Messages loaded:', messages);
      this.messagesSubject.next(messages);
    });
  }

  private async getUserData(uid: string): Promise<any> {
    if (!uid) {
      console.log('No UID provided');
      return null;
    }
    const userRef = doc(this.firestore, `users/${uid}`);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      return userSnapshot.data();
    } else {
      console.log('User not found');
      return null;
    }
  }
  async addMessageToChannel(
    channelId: string, 
    message: string, 
    creatorId: string,     
  ): Promise<void> {
    const messagesRef = collection(this.firestore, `channel/${channelId}/messages`);
  
    // Erstelle eine neue Nachricht
    const newMessage = {
      message,
      creator: creatorId,
      createdAt: new Date().toISOString(),      
      reactions: [],
      thread: [] 
    };
  
    try {
     
      await addDoc(messagesRef, newMessage);
      console.log('Message added to channel');
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }

  
   

  async addThreadMessage(
    channelId: string,
    parentId: string,  // ID der Parent-Nachricht
    message: string,   // Die Thread-Nachricht
    creatorId: string  // Der Creator der Thread-Nachricht
  ): Promise<void> {
    const parentMessageRef = doc(this.firestore, `channel/${channelId}/messages/${parentId}`);
    
    // Erstelle die neue Thread-Nachricht
    const newThreadMessage = {
      message,
      creator: creatorId,
      createdAt: new Date().toISOString(),
      isThread: true,
      parentId,  // Verweist auf die Parent-Nachricht
      reactions: [],
    };
  
    try {
      // Hole die Parent-Nachricht
      const parentMessageSnapshot = await getDoc(parentMessageRef);
      
      if (parentMessageSnapshot.exists()) {
        const parentMessage = parentMessageSnapshot.data();
        
        // Hole das bestehende Thread-Array oder initialisiere es als leeres Array
        const threadMessages = parentMessage?.['thread'] || [];
        
        // Füge die neue Nachricht zum Thread hinzu
        threadMessages.push(newThreadMessage);
  
        // Aktualisiere das Thread-Array in der Parent-Nachricht
        await updateDoc(parentMessageRef, { thread: threadMessages });
        console.log('Thread message added to parent message');
      } else {
        console.error('Parent message not found');
      }
    } catch (error) {
      console.error('Error adding thread message:', error);
      throw error;
    }
  }

  async addReactionToMessage(channelId: string, messageId: string, reaction:ChatReaction): Promise<void> {
    const messagesRef = doc(this.firestore, `channel/${channelId}/messages/${messageId}`);
    try {
      await updateDoc(messagesRef, {
        reactions: arrayUnion(reaction)
      });
      console.log('Reaction added to message');
    } catch (error) {
      console.error('Error adding reaction:', error);
      throw error;
    }
  }

  async changeReactionToMessage(
    i: number,
    j: number,
    message: ChatMessage,
    userId: string,
    channelId: string
  ): Promise<void> {
    const reaction = message.reactions![j];
    const messagesRef = doc(this.firestore, `channel/${channelId}/messages/${message.id}`);  
    if (reaction.creator === userId) {
      console.log("reaction vom creator – is deleted");  
      const newReactions = message.reactions!.filter((_, index) => index !== j);
      try {
        await updateDoc(messagesRef, {
          reactions: newReactions
        });
      } catch (error) {
        console.error("error with deleting Reaktion:", error);
      }  
    } else {
      console.log("reaction from member");  
      const uidIndex = reaction.uids.indexOf(userId);
      if (uidIndex === -1) {
        reaction.uids.push(userId);
      } else {
        reaction.uids.splice(uidIndex, 1);
      }  
      const updatedReactions = [...message.reactions!];
      updatedReactions[j] = reaction;  
      try {
        await updateDoc(messagesRef, {
          reactions: updatedReactions
        });
      } catch (error) {
        console.error("error with adding Reaktion:", error);
      }
    }
  }  

}
