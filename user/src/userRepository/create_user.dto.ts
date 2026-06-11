import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { UserStatus } from './user_status.enum';

export class CreateUserDto {
  @IsString()
  @Length(1, 55)
  name!: string;

  @IsString()
  @Length(6, 100)
  password!: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}