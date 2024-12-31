import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { Result, ResultSchema } from '../result/entities/result.entity';
import { ResultService } from '../result/result.service';
import { TimerModule } from '../timer/timer.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Result.name, schema: ResultSchema },
    ]),
    forwardRef(() => TimerModule),
  ],
  controllers: [UserController],
  providers: [UserService, ResultService],
  exports: [UserService],
})
export class UserModule { }
