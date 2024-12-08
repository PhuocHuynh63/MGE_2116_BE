import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { Result, ResultSchema } from '../result/entities/result.entity';
import { ResultService } from '../result/result.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Result.name, schema: ResultSchema }
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, ResultService],
})
export class UserModule { }
