import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from 'src/common/interfaces/user-payload.interface';
import { EncryptService } from 'src/shared/encrypt/encrypt.service';
import { CreateUserDTO } from '../users/users.dto';
import { UserRepository } from '../users/users.repository';
import { User } from '@prisma/client';

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

  async generateTokens(payload: UserPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRATION'),
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const tokens = await this.generateTokens(payload);
    const hashedRefreshToken = await this.encryptService.hash(
      tokens.refresh_token,
    );
    await this.userRepository.updateRefreshToken(user.id, hashedRefreshToken);
    return {
      success: true,
      message: 'User login successfully',
      data: tokens,
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

  async logout(userId: string) {
    await this.userRepository.updateRefreshToken(userId, null);
    return {
      success: true,
      message: 'Logou successfully',
    };
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.userRepository.findOneById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access denied.');
    const refreshTokenMatches = await this.encryptService.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access denied.');
    const payload = { sub: user.id, email: user.email, role: user.role };
    const tokens = await this.generateTokens(payload);
    const hashedRefreshToken = await this.encryptService.hash(
      tokens.refresh_token,
    );
    await this.userRepository.updateRefreshToken(user.id, hashedRefreshToken);
    return {
      success: true,
      message: 'Generate refresh token successfully',
      data: tokens,
    };
  }
}
