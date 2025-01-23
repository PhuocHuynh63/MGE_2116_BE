import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Mge } from './entities/mge.entity';
import aqp from 'api-query-params';
import { Model } from 'mongoose';
import { CreateMgeDto } from './dto/create-mge.dto';

@Injectable()
export class MgeService {
  constructor(
    @InjectModel(Mge.name) private readonly mgeModel: Model<Mge>,
  ) { }

  async isExistMge(name: string) {
    return await this.mgeModel.exists({ name: name }) ? true : false;
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) {
      current = 1;
    }
    if (!pageSize) {
      pageSize = 10;
    }

    const totalItem = (await this.mgeModel.find(filter)).length;
    const totalPage = Math.ceil(totalItem / pageSize);
    let skip = (current - 1) * pageSize;

    const results = await this.mgeModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .sort({ createdAt: -1, ...sort });
    return { results, totalPage };
  }

  async findByTypeMge(typeMge: string) {
    return await this.mgeModel
      .find({ typeMge })
      .sort({ createdAt: -1 })
      .limit(5)
  }

  async create(createMgeDto: CreateMgeDto) {
    const { name, typeMge, img } = createMgeDto;

    try {
      const isExistMge = await this.mgeModel.exists({ name });

      if (isExistMge) {
        throw new BadRequestException('MGE already exists');
      } else {
        const mge = new this.mgeModel({ name, typeMge, img });
        return await mge.save();
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error('Error when creating MGE');
    }
  }
}
