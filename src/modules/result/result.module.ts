import { Module } from '@nestjs/common';
import { ResultService } from './result.service';
import { ResultController } from './result.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Result, ResultSchema } from './entities/result.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Result.name, schema: ResultSchema },
    ])
  ],
  controllers: [ResultController],
  providers: [ResultService],
})
export class ResultModule { }
