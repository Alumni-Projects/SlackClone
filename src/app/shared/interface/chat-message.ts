import { ChatReaction } from "./chat-reactions";
import { DevspaceAccount } from "./devspace-account";


export interface ChatMessage {
    id?: string;
    createdAt: any;
    creator: string;
    message: string;
    isThread?: boolean;
    reactions?: ChatReaction[];
    creatorData?: DevspaceAccount;    
    thread?: ChatMessage[];
    parentId?: string;
  }
