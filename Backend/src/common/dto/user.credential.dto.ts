import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
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
  @IsPhoneNumber('VN')
  phone: string;

  @IsNotEmpty()
  @IsString()
  old_password: string;

  @IsNotEmpty()
  @IsString()
  new_password: string;

  @IsNotEmpty()
  @IsString()
  confirm_password: string;
}
