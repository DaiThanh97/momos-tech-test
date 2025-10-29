import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty({
    type: String,
    description: 'username must contains 4-20 characters',
  })
  username!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(15)
  @ApiProperty({
    type: String,
    description: 'password must contains 8-32 characters',
  })
  password!: string;
}
