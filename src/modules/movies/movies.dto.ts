import { OmitType, PartialType } from '@nestjs/mapped-types';
import { MovieStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class CreateMovieDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  durationMinutes: number;

  @IsDateString()
  @IsNotEmpty()
  releaseDate: Date;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  genres: number[];

  @IsEnum(MovieStatus)
  @IsOptional()
  status: MovieStatus;

  @IsFile()
  @HasMimeType(['image/png', 'image/jpeg', 'image/jpg', 'image/webp'])
  @MaxFileSize(3000000) // 3mb
  poster: MemoryStoredFile;
}

export class SaveToDB extends OmitType(CreateMovieDTO, ['poster'] as const) {
  @IsNotEmpty()
  @IsString()
  poster: string;
}

export class UpdateMovieDTO extends PartialType(CreateMovieDTO) {}
export class UpdateSaveToDB extends PartialType(
  OmitType(UpdateMovieDTO, ['poster'] as const),
) {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  posterUrl?: string;
}

export class QueryFilters {
  @IsDateString()
  @IsOptional()
  date?: Date;
}
