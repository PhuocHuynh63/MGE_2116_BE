import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MgeService } from './mge.service';
import { CreateMgeDto } from './dto/create-mge.dto';
import { ResponseMessage } from 'src/decorator/custom';


@Controller('mge')
export class MgeController {
  constructor(private readonly mgeService: MgeService) { }

  @Get('all')
  @ResponseMessage('Get all MGEs')
  async findAll(
    @Query() query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
  ) {
    return await this.mgeService.findAll(query, +current, +pageSize);
  }

  @Post('create-mge')
  create(@Body() createMgeDto: CreateMgeDto) {
    return this.mgeService.create(createMgeDto);
  }
}
