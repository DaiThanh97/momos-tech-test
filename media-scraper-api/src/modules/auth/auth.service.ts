import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { LoginResponse } from './interfaces/auth.interface';
import { JwtPayload } from './interfaces/jwt.interface';
import {
  CreateUserError,
  InvalidCredentialsError,
  UsernameExistedError,
} from '../../common/errors/base.error';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { username, password } = loginDto;
    const user = await this.usersService.getUserByUsername(username);

    // If valid
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = {
        sub: user.id,
        username: user.username,
      };

      // Provision token
      const accessToken = this.jwtService.sign(payload);
      const response: LoginResponse = {
        id: user.id,
        name: user.name,
        username: user.username,
        accessToken,
      };

      return response;
    } else {
      throw new InvalidCredentialsError('Invalid credentials');
    }
  }

  async signUp(signUpDto: SignUpDto): Promise<boolean> {
    const { username, password, name } = signUpDto;
    const user = await this.usersService.getUserByUsername(username);
    if (user) {
      throw new UsernameExistedError('Username is existed!');
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await this.usersService.createUser({
      username,
      password: hashedPassword,
      name,
    });

    if (!result) {
      throw new CreateUserError('Sign up failed unexpectedly!');
    }

    return result;
  }
}
