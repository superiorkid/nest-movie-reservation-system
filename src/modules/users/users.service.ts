import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ReservationReposity } from '../reservation/reservation.repository';
import { UserRepository } from './users.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private userRepository: UserRepository,
    private reservationRepository: ReservationReposity,
  ) {}

  async getSession(userId: string) {
    try {
      const user = await this.userRepository.findOneById(userId);
      if (!user) throw new NotFoundException('user not found');
      return {
        success: true,
        message: 'get session successfully',
        data: user,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async getUserReservations(params: { userId: string; isUpcoming: boolean }) {
    const { isUpcoming, userId } = params;
    try {
      const reservations =
        await this.reservationRepository.findManyReservationByUserId({
          userId,
          isUpcoming,
        });

      return {
        success: true,
        message: 'get user reservatins successfully',
        data: reservations,
      };
    } catch (error) {
      this.logger.log(error.stack);
      throw new InternalServerErrorException(error.message);
    }
  }
}
