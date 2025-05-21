import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../shared/database/database.service';
import { CreateUserDTO } from './users.dto';

@Injectable()
export class UserRepository {
  constructor(private db: DatabaseService) {}

  async findOneById(id: string) {
    return this.db.user.findUnique({ where: { id } });
  }

  async findOneByEmail(email: string) {
    return this.db.user.findUnique({ where: { email } });
  }

  async findOnebyUsername(username: string) {
    return this.db.user.findUnique({ where: { username } });
  }

  async findMany(params: { take?: number; skip?: number }) {
    const { skip, take } = params;
    return this.db.user.findMany({ take, skip });
  }

  async create(createUserDTO: CreateUserDTO) {
    const { email, password, username } = createUserDTO;
    return this.db.user.create({ data: { username, email, password } });
  }
}
