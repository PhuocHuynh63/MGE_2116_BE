import { Controller, Get } from '@nestjs/common';
import { HistoryService } from './history.service';
import { ResponseMessage } from 'src/decorator/custom';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) { }

  @Get()
  @ResponseMessage('History found successfully')
  async findHistory() {
    return this.historyService.findHistory();
  }
}
