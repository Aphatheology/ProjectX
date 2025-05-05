import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import config from '../config/config';

export class encrypt {
  static async encryptPassword(password: string) {
    return await bcrypt.hashSync(password, 12);
  }

  static async comparePassword(hashPassword: string, password: string) {
    return await bcrypt.compareSync(password, hashPassword);
  }

  static async generateToken(payload: any) {
    return jwt.sign(payload, config.jwt.accessTokenSecret);
  }
}