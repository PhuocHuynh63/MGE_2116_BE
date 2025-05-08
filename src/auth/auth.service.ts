import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { comparePasswordHelper } from 'src/utils/utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      return null;
    }

    const isMatch = await comparePasswordHelper(password, user.password);
    if (!isMatch) {
      return undefined;
    }


    return user;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user._id, role: user.role };
    return {
      user: {
        _id: user._id,
        username: user.username,
      },
      access_token: this.jwtService.sign(payload),
    }
  }
}
