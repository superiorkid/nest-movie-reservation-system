import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
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
  confirmPassowrd: string;
}
