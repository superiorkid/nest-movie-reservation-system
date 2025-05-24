import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSeatsDTO {
  @IsString()
  @IsNotEmpty()
  seatNumber: string;

  @IsString()
  @IsNotEmpty()
  theaterId: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => ['true', true, '1', 1].indexOf(value) > -1)
  isActive: boolean;
}

export class UpdateSeatsDTO extends PartialType(CreateSeatsDTO) {}

export class SeatFilter {
  @IsString()
  @IsNotEmpty()
  theaterId: string;
}
