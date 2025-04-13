import { UserDocument } from 'src/modules/user/schema/user.schema';

declare module 'express' {
  interface Request {
    user?: UserDocument;
  }
}
