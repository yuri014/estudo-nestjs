import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compareSync } from 'bcrypt';

import { UserService } from '../user/user.service';
import { AuthInput } from './DTO/auth.input';
import { AuthType } from './DTO/auth.type';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(data: AuthInput): Promise<AuthType> {
    const user = await this.userService.findUserByEmail(data.email);

    const validPassword = compareSync(data.password, user.password);

    if (!validPassword) {
      throw new UnauthorizedException('Senha incorreta');
    }

    return {
      user,
      token: 'placeholder',
    };
  }
}
