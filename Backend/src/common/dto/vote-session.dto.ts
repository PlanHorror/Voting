import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class VoteSessionDto {
  @IsUUID()
  @IsNotEmpty()
  supervisorId: string;

  @IsUUID()
  @IsNotEmpty()
  signerId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  endDate: Date;
}

export class VoteSessionCreateDto {
  @IsUUID()
  @IsNotEmpty()
  signerId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  endDate: Date;
}
