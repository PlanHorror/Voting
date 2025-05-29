import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
export class UserSignUpDto {
  @IsNotEmpty()
  @IsString()
  citizenId: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UserSignInDto {
  @IsNotEmpty()
  @IsString()
  citizenId: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UserUpdateDto {
  @IsNotEmpty()
  @IsString()
  citizenId: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  old_password: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  new_password: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  confirm_password: string;
}
