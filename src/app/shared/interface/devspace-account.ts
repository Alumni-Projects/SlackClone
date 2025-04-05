export interface DevspaceAccount {
    displayName: string;
    online: boolean;    
    activeSelf: boolean;
    activeMessage: boolean;
    channel?: string [];
    createdAt?: string;
    emailVerified?: boolean;
    profile?: string;
    uid?: string;
}
