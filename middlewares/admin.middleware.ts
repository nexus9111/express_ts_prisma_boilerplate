import { Role } from '@prisma/client';
import { NextFunction, Response } from 'express';
import { HttpException } from '../exeptions/httpExeption';
import { RequestWithUser } from '../interfaces/auth.interface';

export const AdminRoute = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    if (!(req.user.role === Role.ADMIN || req.user.role === Role.ROOT)) {
        throw new HttpException(401, "You don't have permission");
    }

    next();
  } catch (error) {
    next(error);
  }
};
