import { Role } from 'generated/prisma';

export interface UserPayload {
  sub: string;
  email: string;
  role: Role;
}
