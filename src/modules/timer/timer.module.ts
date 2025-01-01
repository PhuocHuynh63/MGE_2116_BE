import {  Module } from '@nestjs/common';
import { TimerService } from './timer.service';
import { TimerController } from './timer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Timer, TimerSchema } from './entities/timer.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Timer.name, schema: TimerSchema },
    ]),
  ],
  controllers: [TimerController],
  providers: [TimerService ],
})
export class TimerModule { }
