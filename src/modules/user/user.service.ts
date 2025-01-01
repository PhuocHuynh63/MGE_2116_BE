import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RequestUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { TimerService } from '../timer/timer.service';
import { ResultService } from '../result/result.service';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly timerService: TimerService,
    private readonly resultService: ResultService,
  ) { }

  async isUserExist(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid id');
      }

      const isUserExist = await this.userModel.exists({ id });

      return isUserExist ? true : false;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(error);
    }
  }

  async findOne(id: string) {
    try {
      const isUserExist = await this.isUserExist(id);
      if (!isUserExist) {
        throw new BadRequestException('User not found');
      }

      const user = await this.userModel.findOne({ id });

      return user;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(error);
    }
  }

  create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  async requestPoint(requestPointDto: RequestUserDto) {
    const { id, pointsRequest, typeMge, secretKey } = requestPointDto;
    const findUser = await this.userModel.findOne({ id: id });
    const pointsCondition = pointsRequest < 10000000;
    const getTimeActive = await this.timerService.getTimerActive('-user');

    try {
      if (getTimeActive) {
        //Check exception
        if (!findUser) {
          throw new BadRequestException('User not found');
        }

        if (secretKey !== findUser._id.toString()) {
          throw new BadRequestException('Wrong secret key');
        }

        if (pointsCondition) {
          throw new BadRequestException('Points must be at least 10.000.000');
        }

        if (findUser.points < pointsRequest) {
          throw new BadRequestException('Not enough points');
        }
        //End check exception

        const user = await this.timerService.updateUsersTimer(
          requestPointDto,
          getTimeActive,
          findUser
        );
        return user;
      } else {
        throw new BadRequestException('Bidding not yet opened');
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(error);
    }
  }

  async updateUser(updateUserDto: UpdateUserDto) {
    const { admin_key, ...payload } = updateUserDto;
    const findUser = await this.userModel.findOne({ id: payload.id });
    try {
      if (admin_key !== '677255766468b9ff71d6dabf') {
        throw new BadRequestException('Wrong admin key');
      } else {
        if (findUser) {
          const user = await this.userModel.findOneAndUpdate(
            { id: payload.id },
            {
              points: findUser.points + payload.pointsRequest,
              description: payload.description
            },
            { new: true }
          );
          return user
        } else {
          const user = new this.userModel({
            ...payload,
            points: payload.pointsRequest,
            description: 'Create account'
          });
          await user.save();
          return user;
        }
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new Error(error);
      }
    }
  }

  async kingConfirm(secretKey: string) {
    try {
      const timer = await this.timerService.getATimerPending('desc');

      const findAllUsersInTimer = timer.users;
      if (findAllUsersInTimer.length === 0) {
        return [];
      }

      if (secretKey !== '677255766468b9ff71d6dabf') {
        throw new BadRequestException('Wrong secret key');
      } else {
        //Create result for all users in timer
        const createResult = await Promise.all(findAllUsersInTimer.map((user) => {
          const result = this.resultService.createResult({
            id: user.id.toString(),
            ingame: user.ingame,
            points: user.points,
            description: `Bid MGE ${timer.typeMge}`,
          });
          return result;
        }));


        //Update points user
        await Promise.all(findAllUsersInTimer.map(async (user) => {
          const findUser = await this.userModel.findOne({ id: user.id });
          const newPoints = findUser.points - user.points;
          await this.userModel.findOneAndUpdate(
            { id: user.id },
            { points: newPoints },
            { new: true }
          );
        }));

        //Update status timer to complete
        await this.timerService.updateStatusTimerToComplete();

        return createResult;
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(error);
    }
  }
}
