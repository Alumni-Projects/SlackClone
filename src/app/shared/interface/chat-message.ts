export interface ChatMessage {
    id?: string;
    createdAt: any; 
    creator: string;
    message: string;
    isThread?: boolean;
    reactions?: { [emoji: string]: string[] };
}
