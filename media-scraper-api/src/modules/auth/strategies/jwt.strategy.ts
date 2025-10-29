import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { CurrentUser } from '../../users/interfaces/user.interface';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../interfaces/jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<CurrentUser> {
    const { sub } = payload;
    const foundedUser = await this.usersService.getUserById(sub);

    if (!foundedUser) {
      throw new UnauthorizedException();
    }

    const user: CurrentUser = {
      id: foundedUser.id,
      username: foundedUser.username,
      name: foundedUser.name,
    };

    return user;
  }
}
