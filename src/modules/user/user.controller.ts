import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, RequestUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage } from 'src/decorator/custom';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

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
}
