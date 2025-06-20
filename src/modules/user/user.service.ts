import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, RequestUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { TimerService } from '../timer/timer.service';
import { HistoryService } from '../history/history.service';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import aqp from 'api-query-params';
@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly timerService: TimerService,
    private readonly historyService: HistoryService,
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

  async findByUsername(username: string) {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOne(id: string) {
    try {
      const isUserExist = await this.isUserExist(id);
      if (!isUserExist) {
        throw new NotFoundException('User not found');
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

  async findAll(query: string, current: number, pageSize: number) {
    try {
      const { filter, sort } = aqp(query);

      if (filter.current) delete filter.current;
      if (filter.pageSize) delete filter.pageSize;

      if (!current) {
        current = 1;
      }
      if (!pageSize) {
        pageSize = 10;
      }

      const excludedId = "681cf90f70e8637b629afbf6";
      filter._id = { $ne: excludedId };

      const totalItem = (await this.userModel.countDocuments(filter));
      const totalPage = Math.ceil(totalItem / pageSize);
      let skip = (current - 1) * pageSize;

      const results = await this.userModel
        .find(filter)
        .limit(pageSize)
        .skip(skip)
        .sort({ points: -1, ...sort })
        .select('-_id');
      return {
        meta: {
          current: current,
          pageSize: pageSize,
          totalPage: totalPage,
          totalItem: totalItem
        },
        results
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async searchByNameOrId(term: string, current: number, pageSize: number) {
    try {
      if (!current) {
        current = 1;
      }
      if (!pageSize) {
        pageSize = 10;
      }

      const excludedId = "681cf90f70e8637b629afbf6";

      const filter = {
        $and: [
          { _id: { $ne: excludedId } },
          {
            $or: [
              { id: { $regex: term, $options: 'i' } },
              { ingame: { $regex: term, $options: 'i' } },
            ],
          },
        ],
      };


      const totalItem = (await this.userModel.countDocuments(filter));
      const totalPage = Math.ceil(totalItem / pageSize);
      let skip = (current - 1) * pageSize;

      const results = await this.userModel
        .find(filter)
        .limit(pageSize)
        .skip(skip)
        .select('-_id')
        .sort({ points: -1 });

      return {
        meta: {
          current: current,
          pageSize: pageSize,
          totalPage: totalPage,
          totalItem: totalItem
        },
        results
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  async requestPoint(requestPointDto: RequestUserDto) {
    const { id, pointsRequest, secretKey } = requestPointDto;
    const findUser = await this.userModel.findOne({ id: id });
    const pointsCondition = pointsRequest < 10000000;
    const getTimeActive = await this.timerService.getTimerActive('-user');

    try {
      if (getTimeActive) {
        //Check exception
        if (!findUser) {
          throw new NotFoundException('User not found');
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
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(error);
    }
  }

  async updateUser(updateUserDto: UpdateUserDto) {
    const { admin_key, ...payload } = updateUserDto;
    const findUser = await this.userModel.findOne({ id: payload.id });
    try {
      if (admin_key !== '681cf90f70e8637b629afbf6') {
        throw new BadRequestException('Wrong admin key');
      }

      if (findUser) {
        const user = await this.userModel.findOneAndUpdate(
          { id: payload.id },
          {
            points: findUser.points + payload.pointsRequest,
          },
          { new: true }
        );

        await this.historyService.createHistory({
          id: user.id.toString(),
          ingame: user.ingame,
          points: payload.pointsRequest,
          description: payload.description || 'Admin add points',
        });
        return user
      } else {
        const user = new this.userModel({
          ...payload,
          points: payload.pointsRequest,
        });
        await user.save();
        return user;
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
    console.log(secretKey);

    try {
      const timer = await this.timerService.getATimer('desc', 'pending');

      const findAllUsersInTimer = timer.users;
      if (findAllUsersInTimer.length === 0) {
        return [];
      }

      if (secretKey !== '681cf90f70e8637b629afbf6') {
        throw new BadRequestException('Wrong secret key');
      } else {
        //Create history for all users in timer
        const createHistory = await Promise.all(findAllUsersInTimer.map((user) => {
          const history = this.historyService.createHistory({
            id: user.id.toString(),
            ingame: user.ingame,
            points: -user.points,
            description: `Bid MGE ${timer.typeMge}`,
          });
          return history;
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

        return createHistory;
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(error);
    }
  }

  async importCsv(filePath: string): Promise<void> {
    const users = [];

    // Trả về Promise để xử lý async
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => {
          // Giả sử các trường trong CSV là id, ingame, points
          const userData = {
            id: data.id,
            ingame: data.ingame,
            points: Number(data.points),
          };

          // Thêm user vào mảng
          users.push(userData);
        })
        .on('end', resolve)  // Kết thúc đọc file
        .on('error', reject); // Xử lý lỗi
    });

    // Sau khi hoàn tất việc đọc file, xử lý mảng users
    for (const user of users) {
      const existingUser = await this.userModel.findOne({ id: user.id });

      if (existingUser) {
        // Nếu user tồn tại, cộng điểm vào user cũ
        existingUser.points += user.points;
        await existingUser.save();
      } else {
        // Nếu user chưa tồn tại, tạo mới user
        await this.userModel.create(user);
      }
    }

    console.log('CSV data has been processed and imported into MongoDB');
  }

  async exportUserToExcel(res: Response): Promise<void> {
    try {
      // Lấy toàn bộ dữ liệu người dùng từ MongoDB
      const users = await this.userModel.find().sort({ createdAt: -1 }).exec();

      // Tạo một workbook mới
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Users');

      // Định nghĩa các cột trong Excel
      worksheet.columns = [
        { header: 'NO', key: 'no', width: 5 },
        { header: 'ID', key: 'id', width: 20 },
        { header: 'Ingame', key: 'ingame', width: 20 },
        { header: 'Điểm', key: 'points', width: 15 },
        { header: 'Ngày tạo', key: 'createdAt', width: 25 },
        { header: 'Ngày cập nhật', key: 'updatedAt', width: 25 },
      ];

      // Thêm từng dòng vào worksheet
      users.forEach((user, index) => {
        worksheet.addRow({
          no: index + 1,
          id: user.id,
          ingame: user.ingame,
          points: user.points,
          createdAt: new Date(user.createdAt).toLocaleString('vi-VN'),
          updatedAt: new Date(user.updatedAt).toLocaleString('vi-VN'),
        });
      });

      // Thiết lập các header cho file Excel
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''user-export.xlsx`);
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=user-export.xlsx',
      );

      // Ghi workbook vào response và gửi file về client
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error exporting user data:', error);
      res.status(500).send('Error exporting user data');
    }
  }

}
