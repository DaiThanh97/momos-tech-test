import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  CreateDateColumn,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  @Index('IDX_ID')
  id!: number;

  @Column({ unique: true })
  @Index('IDX_USERNAME')
  username!: string;

  @Column()
  @Exclude()
  password!: string;

  @Column()
  name!: string;

  @CreateDateColumn()
  createDate!: Date;
}
