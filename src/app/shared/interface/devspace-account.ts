export interface DevspaceAccount {
    find(arg0: (acc: any) => boolean): unknown;
    displayName: string;
    online: boolean;    
    email?: string;
    channel?: string [];
    createdAt?: string;
    emailVerified?: boolean;
    profile?: string;
    uid?: string | null;
    activeSelf?: boolean;
    id?: string;
}
