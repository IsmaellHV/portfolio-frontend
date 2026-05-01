export type TypeAuthRole = 'admin' | 'user';
export type TypeAuthProvider = 'password' | 'google' | 'github';

export interface EntityUser {
  _id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: TypeAuthRole;
  provider: TypeAuthProvider;
}
