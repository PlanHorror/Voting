import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class SignerSignUpDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class SignerSignInDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class SignerUpdateDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsOptional()
  old_password: string;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.old_password)
  new_password: string;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.old_password)
  confirm_password: string;
}
