import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { HistoryService } from './history.service';
import { ResponseMessage } from 'src/decorator/custom';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) { }

  @Get()
  @ResponseMessage('History found successfully')
  async findHistory(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query('sort') sort: string,
  ) {
    return this.historyService.findHistory(+current, +pageSize, sort);
  }

  @Get('export')
  async exportHistoryToExcel(@Res() res: Response) {
    return this.historyService.exportHistoryToExcel(res);
  }
}
