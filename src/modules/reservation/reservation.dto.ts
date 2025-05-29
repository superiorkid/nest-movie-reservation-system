import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateReservationDTO {
  @IsString()
  @IsNotEmpty()
  showtimeId: string;

  @IsArray()
  @ArrayMinSize(1)
  seatIds: string[];
}
