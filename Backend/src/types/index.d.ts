// types/express/index.d.ts
import { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';

export interface AccessCookieData {
  userID: string | Types.ObjectId
}

declare global {
  namespace Express {
    interface Request {
      user?: AccessCookieData // or define a custom User type
    }
  }
}