import { Role } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { Service } from 'typedi';
import { HttpException } from '../exeptions/httpExeption';
import { SafeUser, User } from '../interfaces/user.interface';
import { CreateUserDto } from '../dto/users.dto';
import { DBService } from './db.service';

@Service()
export class UserService {
    public database = new DBService();

    public async findAllUser(): Promise<User[]> {
        const allUser: User[] = await this.database.getClient().user.findMany();
        return allUser;
    }

    public async findUserById(userId: number): Promise<User> {
        const findUser: User = await this.database.getClient().user.findUnique({ where: { id: userId } });
        if (!findUser) throw new HttpException(409, "User doesn't exist");

        return findUser;
    }

    public async findUserByEmail(email: string): Promise<User> {
        const findUser: User = await this.database.getClient().user.findUnique({ where: { email } });
        return findUser;
    }

    public async createUser(userData: CreateUserDto): Promise<User> {
        const findUser: User = await this.database.getClient().user.findUnique({ where: { email: userData.email } });
        if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

        const hashedPassword = await hash(userData.password, 10);
        const createUserData: User = await this.database.getClient().user.create({ data: { ...userData, password: hashedPassword } });
        return createUserData;
    }

    public async updateUser(userId: number, userData: CreateUserDto): Promise<User> {
        const findUser: User = await this.database.getClient().user.findUnique({ where: { id: userId } });
        if (!findUser) throw new HttpException(401, "You don't have permission");

        const hashedPassword = await hash(userData.password, 10);
        const updateUserData = await this.database.getClient().user.update({ where: { id: userId }, data: { ...userData, password: hashedPassword } });
        return updateUserData;
    }

    public async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<void> {
        const findUser: User = await this.database.getClient().user.findUnique({ where: { id: userId } });
        if (!findUser) throw new HttpException(401, "You don't have permission");

        const isPasswordMatching: boolean = await compare(oldPassword, findUser.password);
        if (!isPasswordMatching) throw new HttpException(409, "Old password is not matching");

        const hashedPassword = await hash(newPassword, 10);
        await this.database.getClient().user.update({ where: { id: userId }, data: { password: hashedPassword } });
    }

    public async deleteUser(userId: number): Promise<void> {
        const findUser: User = await this.database.getClient().user.findUnique({ where: { id: userId } });
        if (!findUser) throw new HttpException(401, "You don't have permission");

        await this.database.getClient().user.delete({ where: { id: userId } });
    }

    public toSafeUser(user: User): SafeUser {
        const { password, role, ...safeUser } = user;

        const su: SafeUser = safeUser;
        su.isAdmin = role === Role.ADMIN;

        return safeUser;
    }

    public isAdmin(user: User): boolean {
        return (user.role === Role.ADMIN || user.role === Role.ROOT)
    }

    public isRoot(user: User): boolean {
        return user.role === Role.ROOT;
    }

    public async getUserCount(): Promise<number> {
        const count = await this.database.getClient().user.count();
        return count;
    }
}