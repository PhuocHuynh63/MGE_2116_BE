import { BadRequestException, Injectable } from '@nestjs/common';
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

    async findHistory(current: number, pageSize: number, sort: string = 'desc') {
        const filter = {};
        const sortOptions: { [key: string]: 1 | -1 } = { createdAt: sort === 'asc' ? 1 : -1 };
        if (sort !== 'asc' && sort !== 'desc') {
            throw new BadRequestException('Invalid sort parameter. Use "asc" or "desc".');
        }

        const skip = (current - 1) * pageSize;
        const limit = pageSize;
        const histories = await this.HistoryModel.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .exec();
        const total = await this.HistoryModel.countDocuments(filter).exec();
        return {
            histories,
            metadata: {
                currentPage: current,
                pageSize: pageSize,
                totalItems: total,
                totalPages: Math.ceil(total / pageSize),
            }
        };
    }
}
