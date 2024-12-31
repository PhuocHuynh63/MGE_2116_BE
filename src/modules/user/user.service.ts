import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RequestUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResultService } from '../result/result.service';
import { TimerService } from '../timer/timer.service';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly resultService: ResultService,
    private readonly timerService: TimerService
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

  create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  async requestPoint(requestPointDto: RequestUserDto) {
    const { id, pointsRequest, typeMge, secretKey } = requestPointDto;
    const findUser = await this.userModel.findOne({ id: id });
    const pointsCondition = pointsRequest < 10000000;
    const isTimerActive = await this.timerService.existTimerActive();

    try {
      if (isTimerActive) {
        if (!findUser) {
          throw new BadRequestException('User not found');
        } else {
          if (secretKey !== findUser._id.toString()) {
            throw new BadRequestException('Wrong secrect key');
          } else {
            if (pointsCondition) {
              throw new BadRequestException('Points must be at least 10.000.000');
            } else {
              if (findUser.points >= pointsRequest) {
                const user = await this.userModel.findOneAndUpdate(
                  { id },
                  { points: findUser.points - pointsRequest },
                  { new: true }
                );

                await this.resultService.create({
                  id: id,
                  ingame: findUser.ingame,
                  pointsBided: pointsRequest,
                  description: `Bid MGE ${typeMge}`
                });

                return user;
              } else {
                throw new BadRequestException('Not enough points');
              }
            }
          }
        }
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
}
