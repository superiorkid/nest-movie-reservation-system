import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTheatersDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => Number)
  @IsNumber()
  capacity: number;

  @Type(() => Number)
  @IsNumber()
  seatsPerRow: number;

  @IsString()
  @IsNotEmpty()
  locationId: string;
}

export class UpdateTheatersDTO extends PartialType(CreateTheatersDTO) {}
