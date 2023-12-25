import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { Routes } from '../interfaces/route.interface';
import { ValidationMiddleware } from '../middlewares/validation.middleware';
import { CreateUserDto } from '../dto/users.dto';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { AdminRoute } from '../middlewares/admin.middleware';

export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, ValidationMiddleware(CreateUserDto), this.user.createUser);
    this.router.post(`${this.path}/login`, ValidationMiddleware(CreateUserDto), this.user.login);
    
    this.router.get(`${this.path}/profile`, AuthMiddleware , this.user.profile);
    this.router.get(`${this.path}/logout`, AuthMiddleware , this.user.logout);
    this.router.get(`${this.path}/`, [AuthMiddleware, AdminRoute] , this.user.getUsers);
    this.router.get(`${this.path}/:id`, [AuthMiddleware, AdminRoute] , this.user.getUserById);
    
    this.router.put(`${this.path}/change-password`, AuthMiddleware , this.user.changePassword);

    this.router.delete(`${this.path}/:id`, AuthMiddleware , this.user.deleteUser);
  }
}