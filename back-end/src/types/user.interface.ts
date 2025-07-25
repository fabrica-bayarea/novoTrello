export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  userName: string;
  role: string;
  authProvider: string;
}
