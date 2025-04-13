import { UserDocument } from 'src/modules/user/user.schema';

declare module 'express' {
  interface Request {
    user?: UserDocument;
  }
}
