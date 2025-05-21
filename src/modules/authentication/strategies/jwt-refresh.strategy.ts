import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserPayload } from 'src/common/interfaces/user-payload.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private configSevice: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configSevice.get<string>('REFRESH_TOKEN_SECRET') || '',
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: UserPayload) {
    const refreshToken = req.get('Authorization')?.replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}
