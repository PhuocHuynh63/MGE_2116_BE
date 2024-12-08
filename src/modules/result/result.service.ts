import { Injectable } from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Result } from './entities/result.entity';
import { Model } from 'mongoose';

@Injectable()
export class ResultService {

  constructor(
    @InjectModel(Result.name) private resultModel: Model<Result>,
  ) { }

  create(createResultDto: CreateResultDto) {
    return this.resultModel.create(createResultDto);
  }
}
