import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import config from '../config/config';

export class encrypt {
  static encryptPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  static comparePassword(plaintext: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plaintext, hash);
  }

  static async generateToken(payload: any) {
    return jwt.sign(payload, config.jwt.accessTokenSecret);
  }
}