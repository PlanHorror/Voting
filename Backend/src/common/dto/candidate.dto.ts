import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CandidateDto {
  @IsUUID()
  @IsNotEmpty()
  voteSessionId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class CandidateDataDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class ListCandidateDto {
  @IsUUID()
  @IsNotEmpty()
  voteSessionId: string;

  @ValidateNested({ each: true })
  @MinLength(1)
  candidates: CandidateDataDto[];
}
