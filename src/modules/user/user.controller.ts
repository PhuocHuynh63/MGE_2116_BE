import { Controller, Get, Post, Body, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, RequestUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage } from 'src/decorator/custom';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @ResponseMessage('Get all users successfully')
  async findAll(
    @Query() query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,) {
    return await this.userService.findAll(query, +current, +pageSize);
  }

  @Get('search')
  @ResponseMessage('Search user successfully')
  async searchByNameOrId(@Query('term') term: string) {
    return await this.userService.searchByNameOrId(term);
  }

  @Post('create-user')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('request-point')
  requestPoint(@Body() createUserDto: RequestUserDto) {
    return this.userService.requestPoint(createUserDto);
  }

  @Post('update-user')
  updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(updateUserDto);
  }

  @Post('king-confirm')
  @ResponseMessage('King confirmed successfully')
  kingConfirm(@Body('secretKey') secretKey: string) {
    return this.userService.kingConfirm(secretKey);
  }

  @Post('import-user')
  @UseInterceptors(FileInterceptor('file'))
  async importCsv(@UploadedFile() file: Express.Multer.File) {
    // Đảm bảo thư mục uploads tồn tại
    const uploadDir = path.resolve(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Đường dẫn tuyệt đối cho file cần lưu
    const filePath = path.resolve(uploadDir, 'POINTS2116-Points.csv');

    // Lưu file vào thư mục uploads
    fs.writeFileSync(filePath, file.buffer);

    // Gọi service để import CSV
    await this.userService.importCsv(filePath);

    return { message: 'File CSV đã được import thành công' };
  }
}
