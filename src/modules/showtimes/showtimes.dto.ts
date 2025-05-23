import { PartialType } from '@nestjs/mapped-types';
import { ShowtimeStatus } from '@prisma/client';
import {
  IsDateString,
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateShowtimeDTO {
  @IsNotEmpty()
  @IsString()
  movieId: string;

  @IsDateString()
  @IsNotEmpty()
  startTime: Date;

  @IsDateString()
  @IsNotEmpty()
  endTime: Date;

  @IsString()
  @IsNotEmpty()
  theaterId: string;

  @IsEnum(ShowtimeStatus)
  status: ShowtimeStatus;

  @IsDecimal()
  price: string;
}

export class UpdateShowtimeDTO extends PartialType(CreateShowtimeDTO) {}
