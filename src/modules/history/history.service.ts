import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { History } from './entities/history.entity';
import { Model } from 'mongoose';
import { CreateHistoryDto } from './dto/create-history.dto';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';


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

    async exportHistoryToExcel(res: Response): Promise<void> {
        const histories = await this.HistoryModel.find().sort({ createdAt: -1 }).exec();

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Histories');

        worksheet.columns = [
            { header: 'NO', key: 'no', width: 5 },
            { header: 'Ingame', key: 'ingame', width: 20 },
            { header: 'ID', key: 'id', width: 20 },
            { header: 'Điểm chênh lệch', key: 'points', width: 20 },
            { header: 'Ghi chú', key: 'description', width: 30 },
            { header: 'Thời gian', key: 'createdAt', width: 25 },
        ];

        histories.forEach((history, index) => {
            worksheet.addRow({
                no: index + 1,
                ingame: history.ingame,
                id: history.id,
                points: history.points,
                description: history.description || 'Chưa có ghi chú',
                createdAt: new Date(history.createdAt).toLocaleString('vi-VN'),
            });
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''history-export.xlsx`);
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=history-export.xlsx',
        );

        await workbook.xlsx.write(res);
        res.end();
    }
}
