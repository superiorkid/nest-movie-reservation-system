import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'generated/prisma';
import { EncryptService } from 'src/shared/encrypt/encrypt.service';
import { CreateUserDTO } from '../users/users.dto';
import { UserRepository } from '../users/users.repository';

@Injectable()
export class AuthenticationService {
  constructor(
    private userRepository: UserRepository,
    private encryptService: EncryptService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) return null;
    const passwordMatch = await this.encryptService.verify(
      user.password || '',
      password,
    );
    if (!passwordMatch) return null;
    return user;
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRATION'),
      }),
    ]);

    return {
      success: true,
      message: 'Login successfully',
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    };
  }

  async register(createUserDto: CreateUserDTO) {
    const { email, password, username } = createUserDto;
    const existingEmail = await this.userRepository.findOneByEmail(email);
    if (!existingEmail) throw new BadRequestException('Email already in use.');

    const existingUsername =
      await this.userRepository.findOnebyUsername(username);
    if (!existingUsername)
      throw new BadRequestException('Username already in use.');

    const hashedPassword = await this.encryptService.hash(password);
    createUserDto.password = hashedPassword;

    try {
      await this.userRepository.create(createUserDto);
      return {
        sucess: true,
        message: 'User register successfully',
      };
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException(
        'Something went wrong. Failed to register.',
      );
    }
  }
}
