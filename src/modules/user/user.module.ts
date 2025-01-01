import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { TimerService } from '../timer/timer.service';
import { Timer, TimerSchema } from '../timer/entities/timer.entity';
import { Result, ResultSchema } from '../result/entities/result.entity';
import { ResultService } from '../result/result.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Timer.name, schema: TimerSchema },
      { name: Result.name, schema: ResultSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, TimerService, ResultService],
})
export class UserModule { }
