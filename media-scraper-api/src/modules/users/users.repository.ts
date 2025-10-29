import { Repository, InsertResult, DataSource } from 'typeorm';
import { CreateUser } from './interfaces/user.interface';
import { UserEntity } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class UsersRepository extends Repository<UserEntity> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(UserEntity, dataSource.manager);
  }

  async createUser(createUserDto: CreateUser): Promise<InsertResult> {
    return this.createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values({
        username: createUserDto.username,
        password: createUserDto.password,
        name: createUserDto.name,
      })
      .execute();
  }

  async getUserById(id: number): Promise<UserEntity | null> {
    return this.createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
  }

  async getUserByUsername(username: string): Promise<UserEntity | null> {
    return this.createQueryBuilder('user')
      .where('user.username = :username', { username })
      .getOne();
  }
}
