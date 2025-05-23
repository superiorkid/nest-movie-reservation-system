import { PartialType } from '@nestjs/mapped-types';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateShowtimeDTO {
  @IsDateString()
  @IsNotEmpty()
  startTime: Date;

  @IsDateString()
  @IsNotEmpty()
  endTime: Date;
}

export class SaveToDB extends CreateShowtimeDTO {
  @IsNotEmpty()
  @IsString()
  movieId: string;
}

export class UpdateShowtimeDTO extends PartialType(SaveToDB) {}
