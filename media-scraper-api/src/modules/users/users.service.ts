import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserEntity } from './entities/user.entity';
import { CreateUser } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(createUser: CreateUser): Promise<boolean> {
    const result = await this.usersRepository
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values({
        username: createUser.username,
        password: createUser.password,
        name: createUser.name,
      })
      .execute();

    const success = !!result.identifiers[0].id;
    return success;
  }

  async getUserById(id: number): Promise<UserEntity | null> {
    return this.usersRepository.getUserById(id);
  }

  async getUserByUsername(username: string): Promise<UserEntity | null> {
    return this.usersRepository.getUserByUsername(username);
  }
}
