import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { TimerService } from '../timer/timer.service';
import { Timer, TimerSchema } from '../timer/entities/timer.entity';
import { History, HistorySchema } from '../history/entities/history.entity';
import { HistoryService } from '../history/history.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Timer.name, schema: TimerSchema },
      { name: History.name, schema: HistorySchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, TimerService, HistoryService],
})
export class UserModule { }
