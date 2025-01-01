import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { History } from './entities/history.entity';
import { Model } from 'mongoose';
import { CreateHistoryDto } from './dto/create-history.dto';


@Injectable()
export class HistoryService {
    constructor(
        @InjectModel(History.name) private HistoryModel: Model<History>,
    ) { }

    async createHistory(CreateHistoryDto: CreateHistoryDto) {
        return this.HistoryModel.create(CreateHistoryDto);
    }

    async findHistory() {
        return this.HistoryModel
            .find()
            .limit(9)
            .sort({ createdAt: -1 });
    }

}
