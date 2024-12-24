import { Module } from '@nestjs/common';
import { MgeService } from './mge.service';
import { MgeController } from './mge.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Mge, MgeSchema } from './entities/mge.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Mge.name, schema: MgeSchema },
    ]),
  ],
  controllers: [MgeController],
  providers: [MgeService],
})
export class MgeModule {}
