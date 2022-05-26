interface metaData {
  createdAt: string;
  creationTime: string;
  lastLoginAt: string;
  lastSignInTime: string;
}
interface stsTokenManager {
  accessToken: string;
  expirationTime: number;
  refreshToken: string;
}

export default interface User {
  accessToken: string | null;
  auth: any;
  displayName: string | null;
  email: string | null;
  emailVerified: boolean | null;
  isAnonymous: boolean;
  metaData: metaData;
  phoneNumber: number | string | null;
  photoURL: string;
  proactiveRefresh: any;
  providerData: any[];
  providerId: string;
  reloadListener: any;
  reloadUserInfor: any;
  stsTokenManager: stsTokenManager;
  tenantId: any;
  uid: string;
}