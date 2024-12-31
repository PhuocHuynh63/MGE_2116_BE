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

  @Get('/timer-complete-desc')
  @ResponseMessage('Timer found successfully')
  async getATimerCompleteDesc() {
    return this.timerService.getATimerCompleteDesc();
  }

  @Post('/set-timer')
  @ResponseMessage('Timer set successfully')
  setTimer(@Body() setTimerDto: CreateTimerDto) {
    return this.timerService.setTimer(setTimerDto);
  }

  @Put('/update/status-timer')
  @ResponseMessage('Status timer updated successfully')
  updateStatusTimer() {
    return this.timerService.updateStatusTimer();
  }
}
