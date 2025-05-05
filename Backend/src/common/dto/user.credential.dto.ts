import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
export class UserSignUpDto {
  @IsNotEmpty()
  @IsString()
  citizenId: string;

  @IsNotEmpty()
  @IsPhoneNumber('VN')
  phoneNumber: string;

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
