import { Users } from '@prisma/client';

declare global {
  declare namespace Express {
    export interface Request {
      user?: Users;
    }
  }
}
