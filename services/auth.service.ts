import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import { CreateUserDto } from '../dto/users.dto';
import { User } from '../interfaces/user.interface';
import { HttpException } from '../exeptions/httpExeption';
import { DataStoredInToken, TokenData } from '../interfaces/auth.interface';
import { JWT_SECRET } from '../config/variables';
import { UserService } from './user.service';

@Service()
export class AuthService {
  public users = new UserService();

  public async signup(userData: CreateUserDto): Promise<User> {
    const findUser: User = await this.users.findUserByEmail(userData.email);
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const userDto: CreateUserDto = { ...userData, password: hashedPassword };
    const createUserData: User = await this.users.createUser(userDto);

    return createUserData;
  }

  public async login(userData: CreateUserDto): Promise<{ cookie: string; findUser: User }> {
    const findUser: User = await this.users.findUserByEmail(userData.email);
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "Password is not matching");

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    return { cookie, findUser };
  }

  public async logout(userData: User): Promise<User> {
    // todo: implement logout
    return userData;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secretKey: string = JWT_SECRET;
    const expiresIn: number = 60 * 60 * 24;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}; Path=/;`;
  }
}