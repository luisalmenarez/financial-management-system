import { DefaultSession } from 'better-auth/types';

declare module 'better-auth/types' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'USER' | 'ADMIN';
    } & DefaultSession['user'];
  }
}
