import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

export class CreateUserDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @Match(CreateUserDTO, (object) => object.password)
  confirmPassword: string;
}

export class ReservationParamsDTO {
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => ['true', true, '1', 1].indexOf(value) > -1)
  upcoming: boolean;
}
