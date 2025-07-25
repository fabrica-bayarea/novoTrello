export interface ResetPasswordPayload {
  userId: string;
  email: string;
  purpose: 'reset-password';
  iat?: number;
  exp?: number;
}
