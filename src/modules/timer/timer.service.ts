import { BadRequestException, Injectable } from '@nestjs/common';
import { Timer } from './entities/timer.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTimerDto } from './dto/create-timer.dto';
@Injectable()
export class TimerService {
  constructor(
    @InjectModel(Timer.name) private TimerModel: Model<Timer>,
  ) { }

  async existTimerActive() {
    try {
      const lastTime = await this.TimerModel
        .findOne({ status: 'active' });
      if (!lastTime) {
        return false;
      }
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getTimerActive() {
    try {
      const lastTime = await this.TimerModel
        .findOne({ status: 'active' })
      if (!lastTime) {
        throw new BadRequestException('No timer found');
      }
      return lastTime;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(error);
    }
  }

  async setTimer(setTimerDto: CreateTimerDto) {
    const { ...props } = setTimerDto;
    try {
      if (props.secretKey !== '6772552b67b6bdd9ce8e79d4') {
        throw new BadRequestException('Invalid secrect key');
      } else {
        const isExistTimer = await this.existTimerActive();
        if (isExistTimer) {
          const timer = await this.TimerModel.findOneAndUpdate(
            { status: 'active' },
            setTimerDto,
            { new: true },
          );
          return timer;
        } else {
          const timer = new this.TimerModel(setTimerDto);
          await timer.save();
          return timer;
        }
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(error);
    }
  }

  async updateStatusTimer() {
    try {
      const timerActive = await this.getTimerActive();
      if (!timerActive) {
        throw new BadRequestException('No timer found');
      }
      const updateStatus = await this.TimerModel.findOneAndUpdate(
        { status: 'active' },
        { status: 'complete' },
      );
      return updateStatus
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(error);
    }
  }
}
