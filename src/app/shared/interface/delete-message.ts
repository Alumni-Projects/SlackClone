import { ChatMessage } from "./chat-message";

export interface DeleteMessage {
        i: number,
        message: ChatMessage,
        userId: string,
        channelId: string,
        parentMessageId: string,
        threadId: string,
        editMessage:string,
        dmId:string, 
        section: 'channel' | 'thread'| 'directmessage'
}
