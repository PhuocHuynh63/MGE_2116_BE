import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { Result, ResultSchema } from '../result/entities/result.entity';
import { ResultService } from '../result/result.service';
import { TimerService } from '../timer/timer.service';
import { Timer, TimerSchema } from '../timer/entities/timer.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Result.name, schema: ResultSchema },
      { name: Timer.name, schema: TimerSchema }
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, ResultService, TimerService],
})
export class UserModule { }
