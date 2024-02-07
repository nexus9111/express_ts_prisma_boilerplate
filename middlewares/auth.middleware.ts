import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '../config/variables';
import { HttpException } from '../exeptions/httpExeption';
import { DataStoredInTokenExp, RequestWithUser } from '../interfaces/auth.interface';
import { UserService } from '../services/user.service';

const getAuthorization = (req) => {
  const coockie = req.cookies['Authorization'];
  if (coockie) return coockie;

  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
}

export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = getAuthorization(req);

    if (Authorization) {
      const { id, exp } = (await verify(Authorization, JWT_SECRET)) as DataStoredInTokenExp;
      if (exp * 1000 < new Date().getTime()) {
        next(new HttpException(401, 'Wrong authentication token'));
      }
      
      const users = new UserService();
      const findUser = await users.findUserById(id);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};
