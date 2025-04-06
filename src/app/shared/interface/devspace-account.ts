export interface DevspaceAccount {
    displayName: string;
    online: boolean;    
    email?: string;
    channel?: string [];
    createdAt?: string;
    emailVerified?: boolean;
    profile?: string;
    uid?: string | null;
    activeSelf?: boolean;
}
