import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
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
  @MaxLength(18)
  @ApiProperty({
    type: String,
    description: 'password must contains 6-18 characters',
  })
  password!: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty({
    type: String,
    description: 'name must contains 4-20 characters',
  })
  name!: string;
}
