import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class VoteDto {
  @IsUUID()
  @IsNotEmpty()
  voteSessionId: string;

  @IsUUID()
  @IsNotEmpty()
  candidateId: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isVoted: boolean;

  @IsString()
  @IsNotEmpty()
  key: string;
}
