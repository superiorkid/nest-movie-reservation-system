import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class EncryptService {
  async hash(text: string): Promise<string> {
    return argon2.hash(text);
  }

  async verify(hashText: string, text: string): Promise<boolean> {
    return argon2.verify(hashText, text);
  }
}
