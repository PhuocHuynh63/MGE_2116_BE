import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Result } from './entities/result.entity';
import { Model } from 'mongoose';
import { CreateResultDto } from './dto/create-result.dto';


@Injectable()
export class ResultService {
    constructor(
        @InjectModel(Result.name) private ResultModel: Model<Result>,
    ) { }

    async createResult(CreateResultDto: CreateResultDto) {
        return this.ResultModel.create(CreateResultDto);
    }

}
