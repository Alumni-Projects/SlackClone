export interface DevspaceAccount {
    displayName: string;
    active: boolean;    
    activeSelf: boolean;
    activeMessage: boolean;
    channel?: string [];
    createdAt?: string;
    emailVerified?: boolean;
    profile?: string;
    uid?: string;
}
