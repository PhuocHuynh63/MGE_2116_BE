import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Timer } from './entities/timer.entity';
import { Model, Types } from 'mongoose';
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

  async getATimerPending(sort: string) {
    try {
      const lastTime = await this.TimerModel
        .findOne({ status: 'pending' })
        .sort({ createdAt: sort === 'desc' ? -1 : 1 })

      if (lastTime === null) {
        throw new NotFoundException('No timer found');
      }

      lastTime.users.sort((a, b) => b.points - a.points);

      return lastTime;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(error);
    }
  }

  async getTimerActive(selectedFields: string = '') {
    try {
      const lastTime = await this.TimerModel
        .findOne({ status: 'active' })
        .select(`${selectedFields}`)
      if (!lastTime) {
        throw new NotFoundException('No timer found');
      }
      return lastTime;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(error);
    }
  }

  async getTimerPending() {
    try {
      const lastTime = await this.TimerModel
        .findOne({ status: 'pending' });
      if (!lastTime) {
        throw new NotFoundException('No timer found');
      }
      return lastTime;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(error);
    }
  }

  async setTimer(setTimerDto: CreateTimerDto) {
    const { ...props } = setTimerDto;
    try {
      if (props.secretKey !== '6772552b67b6bdd9ce8e79d4') {
        throw new BadRequestException('Invalid secret key');
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

  async updateStatusTimerToPending() {
    try {
      await this.getTimerActive();

      const updateStatus = await this.TimerModel.findOneAndUpdate(
        { status: 'active' },
        { status: 'pending' },
      );
      return updateStatus
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(error);
    }
  }

  async updateStatusTimerToComplete() {
    try {
      await this.getTimerPending();

      const updateStatus = await this.TimerModel.findOneAndUpdate(
        { status: 'pending' },
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

  async updateUsersTimer(userRequest: any, timer: any, user: any) {
    try {
      // const findTimer = await this.TimerModel.findOne({ status: 'active' });
      if (!timer) {
        return
      }

      const findAUserInTimer = timer.users.find((u) => u?.id === userRequest?.id);
      //Push user to array users in timer
      if (!findAUserInTimer) {
        timer.users.push({
          id: userRequest.id,
          points: userRequest.pointsRequest,
          ingame: userRequest.ingame,
          date: new Date(),
        });
        await timer.save();
        return { message: `You have successfully bid with ${userRequest.pointsRequest} points` };
      } else {
        //Update points of user in array users in timer
        const newPoints = Number(findAUserInTimer.points) + Number(userRequest.pointsRequest);
        const previousPoints = Number(findAUserInTimer.points);

        if (user.points < newPoints) {
          throw new BadRequestException(`You have exceeded your current points. Your current bonus points are ${user.points}, your previous bid bonus points are ${userRequest.pointsRequest}`);
        }
        //Save new points to user in timer
        findAUserInTimer.date = new Date();
        findAUserInTimer.points = newPoints;
        timer.markModified('users');
        await timer.save();

        return { newPoints, message: `You previously bid ${previousPoints} bonus points. You have successfully bid a total of ${newPoints} bonus points.` };
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(error);
    }
  }


}
