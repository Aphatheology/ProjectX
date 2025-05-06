import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import config from '../config/config';
import { User } from '../entities/User';
import moment from 'moment';

export class encrypt {
  static encryptPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  static comparePassword(plaintext: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plaintext, hash);
  }

  static async generateToken(user: User) {
    const payload = {
      userId: user.id,
      email: user.email,
      isSuperAdmin: user.isSuperAdmin,
      roleId: user.roleId,
      iat: moment().unix(),
      exp: moment().add(config.jwt.accessTokenExpireInMinute, "minutes").unix(),
    };

    return jwt.sign(payload, config.jwt.accessTokenSecret);
  }
}