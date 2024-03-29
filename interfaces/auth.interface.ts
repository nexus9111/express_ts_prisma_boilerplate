import { Request } from 'express';
import { User } from './user.interface';

export interface DataStoredInToken {
  id: number;
}

export interface DataStoredInTokenExp {
  id: number;
  exp: number;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}