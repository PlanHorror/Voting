import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class SupervisorSignUpDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class SupervisorSignInDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
export class SupervisorUpdateDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
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
