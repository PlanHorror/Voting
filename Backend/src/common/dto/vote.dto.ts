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

  @IsString()
  @IsNotEmpty()
  key: string;
}

export class UseVoteDto {
  @IsString()
  @IsNotEmpty()
  candidateIdHash: string;

  @IsString()
  @IsNotEmpty()
  key: string;
}
