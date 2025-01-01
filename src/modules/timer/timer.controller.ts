import { Controller, Get, Post, Body, Put, Query } from '@nestjs/common';
import { TimerService } from './timer.service';
import { CreateTimerDto } from './dto/create-timer.dto';
import { ResponseMessage } from 'src/decorator/custom';


@Controller('timer')
export class TimerController {
  constructor(private readonly timerService: TimerService) { }

  @Get('/timer-active')
  @ResponseMessage('Timer found successfully')
  async getTimerActive(@Query('selectedFields') selectedFields: string) {
    return this.timerService.getTimerActive(selectedFields);
  }

  @Get('/timer-pending')
  @ResponseMessage('Timer found successfully')
  async getATimerPending(@Query('sort') sort) {
    return this.timerService.getATimerPending(sort);
  }

  @Post('/set-timer')
  @ResponseMessage('Timer set successfully')
  setTimer(@Body() setTimerDto: CreateTimerDto) {
    return this.timerService.setTimer(setTimerDto);
  }

  @Put('/update/status-timer-pending')
  @ResponseMessage('Status timer updated successfully')
  updateStatusTimerToPending() {
    return this.timerService.updateStatusTimerToPending();
  }
}
