import { forwardRef, Module } from '@nestjs/common';
import { TimerService } from './timer.service';
import { TimerController } from './timer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Timer, TimerSchema } from './entities/timer.entity';
import { UserService } from '../user/user.service';
import { User, UserSchema } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Timer.name, schema: TimerSchema },
    ]),
    forwardRef(() => UserModule),
  ],
  controllers: [TimerController],
  providers: [TimerService],
  exports: [TimerService],
})
export class TimerModule { }
