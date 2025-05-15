import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { User } from 'firebase/auth';
import { Firestore, doc, setDoc, getDoc, getFirestore, updateDoc, collection, getDocs, query, where, onSnapshot, addDoc, deleteDoc, arrayRemove, arrayUnion, serverTimestamp, orderBy } from 'firebase/firestore';
import { firebaseConfig } from '../../../../environments/environment';
import { Devspace } from '@shared/interface/devspace';
import { BehaviorSubject } from 'rxjs';
import { ChatMessage } from '@shared/interface/chat-message';
import { ChatReaction } from '@shared/interface/chat-reactions';
import { DevspaceAccount } from '@shared/interface/devspace-account';

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
  private threadMessagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  threadMessages$ = this.threadMessagesSubject.asObservable();
  selectedThreadMessage: ChatMessage | null = null;
  private directMessagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  directMessages$ = this.directMessagesSubject.asObservable();
  private directMessagesUserSubject = new BehaviorSubject<any[]>([]);
  directMessagesUser$ = this.directMessagesUserSubject.asObservable();


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
    } catch (error) {
      console.error('Error when adding the user to the channel:', error);
      throw error;
    }
  }
  subscribeToMessages(channelId: string): void {
    const messagesRef = collection(this.firestore, `channel/${channelId}/messages`);
    onSnapshot(messagesRef, async (querySnapshot) => {
      if (querySnapshot.empty) {
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
      this.messagesSubject.next(messages);
    });
  }

  subscribeToThreadMessages(channelId: string, parentMessageId: string): void {
    const threadRef = collection(this.firestore, `channel/${channelId}/messages/${parentMessageId}/threads`);
    onSnapshot(threadRef, async (querySnapshot) => {
      const threadMessages: ChatMessage[] = [];
      for (const doc of querySnapshot.docs) {
        const data = doc.data() as ChatMessage;
        const creatorData = await this.getUserData(data.creator);
        threadMessages.push({ id: doc.id, ...data, creatorData });
      }
      threadMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      this.threadMessagesSubject.next(threadMessages);
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
    const newMessage = {
      message,
      creator: creatorId,
      createdAt: new Date().toISOString(),
      reactions: [],
      threadCount: 0,
    };
    try {

      await addDoc(messagesRef, newMessage);
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }

  async addThreadMessage(
    channelId: string,
    parentMessageId: string,
    message: string,
    creatorId: string
  ): Promise<void> {
    const threadRef = collection(this.firestore, `channel/${channelId}/messages/${parentMessageId}/threads`);

    const newThreadMessage = {
      message,
      creator: creatorId,
      createdAt: new Date().toISOString(),
      isThread: true,
      parentId: parentMessageId,
      reactions: [],
    };

    try {
      await addDoc(threadRef, newThreadMessage);
      await this.updateThreadCount(channelId, parentMessageId);
      if (this.selectedThreadMessage?.id === parentMessageId) {
        this.selectedThreadMessage.threadCount! += 1;
        this.selectedThreadMessage = { ...this.selectedThreadMessage };
      }
    } catch (error) {
      console.error('Error adding thread message:', error);
      throw error;
    }
  }

  async updateThreadCount(channelId: string, messageId: string): Promise<void> {
    const threadRef = collection(this.firestore, `channel/${channelId}/messages/${messageId}/threads`);
    const threadSnapshot = await getDocs(threadRef);
    const threadCount = threadSnapshot.size;
    const messageRef = doc(this.firestore, `channel/${channelId}/messages/${messageId}`);
    await updateDoc(messageRef, { threadCount: threadCount });
  }


  async addReactionToMessage(
    channelId: string,
    messageId: string,
    reaction: ChatReaction,
    parentMessageId?: string,
    threadId?: string
  ): Promise<void> {
    try {
      if (parentMessageId && threadId) {
        const threadRef = doc(this.firestore, `channel/${channelId}/messages/${parentMessageId}/threads/${threadId}`);
        await updateDoc(threadRef, {
          reactions: arrayUnion(reaction)
        });
      } else {
        const messagesRef = doc(this.firestore, `channel/${channelId}/messages/${messageId}`);
        await updateDoc(messagesRef, {
          reactions: arrayUnion(reaction)
        });
      }
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
    channelId: string,
    parentMessageId?: string,
    threadId?: string
  ): Promise<void> {
    const reaction = message.reactions![j];
    let messageRef;
    if (parentMessageId && threadId) {
      messageRef = doc(this.firestore, `channel/${channelId}/messages/${parentMessageId}/threads/${threadId}`);
    } else {
      messageRef = doc(this.firestore, `channel/${channelId}/messages/${message.id}`);
    }

    if (reaction.creator === userId) {
      const newReactions = message.reactions!.filter((_, index) => index !== j);
      try {
        await updateDoc(messageRef, {
          reactions: newReactions
        });
      } catch (error) {
        console.error("error with deleting Reaktion:", error);
      }
    } else {
      const uidIndex = reaction.uids.indexOf(userId);
      if (uidIndex === -1) {
        reaction.uids.push(userId);
      } else {
        reaction.uids.splice(uidIndex, 1);
      }
      const updatedReactions = [...message.reactions!];
      updatedReactions[j] = reaction;
      try {
        await updateDoc(messageRef, {
          reactions: updatedReactions
        });
      } catch (error) {
        console.error("error with adding Reaktion:", error);
      }
    }
  }

  async editMessage({
    index,
    message,
    userId,
    channelId,
    parentMessageId,
    threadId,
    editMessage,
    dmId
  }: {
    index: number;
    message: ChatMessage;
    userId: string;
    channelId: string;
    parentMessageId?: string;
    threadId?: string;
    editMessage?: string;
    dmId?: string;
  }): Promise<void> {
    let messageRef;
    if (channelId && parentMessageId && threadId) {
      messageRef = doc(
        this.firestore,
        `channel/${channelId}/messages/${parentMessageId}/threads/${threadId}`
      );
    } else if (channelId) {
      messageRef = doc(
        this.firestore,
        `channel/${channelId}/messages/${message.id}`
      );
    } else if (dmId) {
      messageRef = doc(
        this.firestore,
        `directMessages/${dmId}/messages/${message.id}`
      );
    } else {

      throw new Error('error with editing Message.');
    }

    try {
      await updateDoc(messageRef, {
        message: editMessage
      });
    } catch (error) {
      console.error("error with editing Message:", error);
    }
  }

  async deleteMessage({
    message,
    channelId,
    parentMessageId,
    threadId,
    dmId
  }: {
    message: ChatMessage;
    channelId?: string;
    parentMessageId?: string;
    threadId?: string;
    dmId?: string;
  }): Promise<void> {
    let messageRef;

    const isThread = !!(channelId && parentMessageId && threadId);
    const isChannelMessage = !!(channelId && !parentMessageId && !threadId);
    const isDirectMessage = !!dmId;

    if (isThread) {
      messageRef = doc(
        this.firestore,
        `channel/${channelId}/messages/${parentMessageId}/threads/${threadId}`
      );
    } else if (isChannelMessage) {
      messageRef = doc(
        this.firestore,
        `channel/${channelId}/messages/${message.id}`
      );
    } else if (isDirectMessage) {
      messageRef = doc(
        this.firestore,
        `directMessages/${dmId}/messages/${message.id}`
      );
    } else {
      throw new Error('Invalid message path - channelId or dmId required.');
    }

    try {
      await deleteDoc(messageRef);

      if (isThread) {
        await this.updateThreadCount(channelId, parentMessageId!);

        if (this.selectedThreadMessage?.id === parentMessageId) {
          this.selectedThreadMessage.threadCount = Math.max(
            (this.selectedThreadMessage.threadCount || 1) - 1,
            0
          );
          this.selectedThreadMessage = { ...this.selectedThreadMessage };
        }
      }

    } catch (error) {
      console.error("Error deleting message:", error);
    }
  }
  async findDmUsers(userId: string): Promise<{ dmId: string, userData: any }[]> {
    const loggedInUserId = userId;
    const dmCollectionRef = collection(this.firestore, 'directMessages');
    const dmData: { dmId: string, userData: any }[] = [];
    const selfDmId = `${loggedInUserId}_${loggedInUserId}`;
    const selfDmDoc = await getDoc(doc(dmCollectionRef, selfDmId));
    if (selfDmDoc.exists()) {
      const userData = await this.getUserDataForDm(loggedInUserId);
      dmData.push({ dmId: selfDmId, userData });
    }
    const q = query(dmCollectionRef, where('participants', 'array-contains', loggedInUserId));
    const querySnapshot = await getDocs(q);
    for (const doc of querySnapshot.docs) {
      const dmId = doc.id;
      const participants = doc.data()['participants'] as string[];
      const isSelfDm = participants.length === 1 && participants[0] === loggedInUserId;
      const isTwoPersonDm = participants.length === 2 && participants.includes(loggedInUserId);
      if (!isSelfDm && !isTwoPersonDm) continue;
      if (dmData.some(dm => dm.dmId === dmId)) continue;
      const otherUserId = isSelfDm
        ? loggedInUserId
        : participants.find((id) => id !== loggedInUserId);
      if (!otherUserId) continue;
      const userData = await this.getUserDataForDm(otherUserId);
      dmData.push({ dmId, userData });
    }
    onSnapshot(dmCollectionRef, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type !== 'added') return;
        const newDmId = change.doc.id;
        if (dmData.some(dm => dm.dmId === newDmId)) return;
        const participants = change.doc.data()['participants'] as string[];
        const isSelfDm = participants.length === 1 && participants[0] === loggedInUserId;
        const isTwoPersonDm = participants.length === 2 && participants.includes(loggedInUserId);
        if (!isSelfDm && !isTwoPersonDm) return;
        const otherUserId = isSelfDm
          ? loggedInUserId
          : participants.find((id) => id !== loggedInUserId);
        if (!otherUserId) return;

        this.getUserDataForDm(otherUserId).then((userData) => {
          dmData.push({ dmId: newDmId, userData });
          this.directMessagesUserSubject.next(dmData);
        });
      });
    });

    return dmData;
  }


  async getUserDataForDm(userId: string): Promise<any> {
    if (!userId) {
      console.warn('not data from getUserDataForDm');
      return null;
    }
    const userRef = doc(this.firestore, 'users', userId);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      return userSnapshot.data();
    } else {
      console.log('user not found');
      return null;
    }
  }
  async findDmIdBetweenUsers(userAId: string, userBId: string): Promise<string | null> {
    const dmCollectionRef = collection(this.firestore, 'directMessages');

    if (userAId === userBId) {
      const dmId = `${userAId}_${userAId}`;
      const dmDoc = await getDoc(doc(dmCollectionRef, dmId));
      return dmDoc.exists() ? dmId : null;
    } else {
      const q = query(dmCollectionRef, where('participants', 'array-contains', userAId));
      const querySnapshot = await getDocs(q);
      for (const doc of querySnapshot.docs) {
        const participants = doc.data()['participants'] as string[];
        if (participants.includes(userBId)) {
          return doc.id;
        }
      }
    }

    return null;
  }


  async subscribeToDirectMessage(loggedInUserId: string, otherUserId: string) {
    const dmId = await this.findDmIdBetweenUsers(loggedInUserId, otherUserId);
    if (!dmId) {
      console.warn('no foundet DM.');
      return;
    }
    const messagesRef = collection(this.firestore, `directMessages/${dmId}/messages`);
    const q = query(messagesRef, orderBy('createdAt', 'asc'));
    onSnapshot(q, async (querySnapshot) => {
      const messages = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data() as ChatMessage;
          const creatorData = await this.getUserData(data.creator);
          return { id: doc.id, ...data, creatorData };
        })
      );
      this.directMessagesSubject.next(messages);
    });
  }

  async checkAndCreateDirectMessage(contactId: string, creatorId: string): Promise<string> {    
    const isSelfDm = contactId === creatorId;
    const dmId = isSelfDm ? `${creatorId}_${creatorId}` : [contactId, creatorId].sort().join('_');    
    const dmRef = doc(this.firestore, `directMessages/${dmId}`);
    const dmDoc = await getDoc(dmRef);

    if (!dmDoc.exists()) {
      const participants = isSelfDm ? [creatorId] : [contactId, creatorId];
      const dmData = {
        participants,
        createdAt: new Date().toISOString()
      };
      await setDoc(dmRef, dmData);
    }

    return dmId;
  }

  async addMessageToDirectMessage(dmId: string, message: string, creatorId: string): Promise<void> {
    const messageData = {
      creator: creatorId,
      message: message,
      createdAt: new Date().toISOString(),
      reactions: []
    };
    const messagesRef = collection(this.firestore, `directMessages/${dmId}/messages`);
    await addDoc(messagesRef, messageData);
  }

  async addMessageToDM(dmId: string, message: string, creatorId: string): Promise<void> {
    const messageData = {
      creator: creatorId,
      message: message,
      createdAt: new Date().toISOString(),
      reactions: []
    };
    const messagesRef = collection(this.firestore, `directMessages/${dmId}/messages`);
    await addDoc(messagesRef, messageData);
  }


  async addReactionToDm(
    dmId: string,
    messageId: string,
    reaction: ChatReaction,
  ): Promise<void> {
    try {
      const threadRef = doc(this.firestore, `directMessages/${dmId}/messages/${messageId}`);
      await updateDoc(threadRef, {
        reactions: arrayUnion(reaction)
      });

    } catch (error) {
      console.error('Error adding reaction:', error);
      throw error;
    }
  }

  async changeReactionToDM(
    i: number,
    j: number,
    message: ChatMessage,
    userId: string,
    dmId: string
  ): Promise<void> {
    const reaction = message.reactions![j];
    const messagesRef = doc(this.firestore, `directMessages/${dmId}/messages/${message.id}`);

    if (reaction.creator === userId) {
      const newReactions = message.reactions!.filter((_, index) => index !== j);
      try {
        await updateDoc(messagesRef, {
          reactions: newReactions
        });
      } catch (error) {
        console.error("error with deleting Reaktion:", error);
      }
    } else {
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
